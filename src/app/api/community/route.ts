import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/models/Post';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sendPushNotification } from '@/lib/webpush';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get('type') || 'ALL';

    await connectDB();
    await connectDB();
    const session = await getServerSession(authOptions);
    const myEmail = session?.user?.email;
    let myUsername = null;
    let mySavedPosts: string[] = [];
    let myFollowing: string[] = [];
    if (myEmail) {
      const me = await User.findOne({ email: myEmail }).lean();
      if (me) {
        myUsername = me.username;
        mySavedPosts = me.savedPosts || [];
        myFollowing = me.following || [];
      }
    }
    
    // Fetch posts based on type
    let query = {};
    if (typeParam !== 'ALL') {
      query = { type: typeParam };
    } else {
      // By default fetch everything EXCEPT things that shouldn't be in the feed (like maybe private things, but we want all standard types here)
      query = { type: { $in: ['POST', 'ANNOUNCEMENT', 'GUIDE'] } };
    }

    const posts = await Post.find(query).sort({ createdAt: -1 }).lean();

    // Fetch users to map avatars and usernames
    const authorEmails = posts.map(p => p.authorId);
    const users = await User.find({ email: { $in: authorEmails } }).lean();
    const userMap: Record<string, any> = {};
    users.forEach(u => {
      userMap[u.email] = {
        name: u.name,
        username: u.username,
        image: u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`
      };
    });

    const formattedPosts = posts.map(post => {
      const isLegacyMedia = !post.media && (post.content && (post.content.startsWith('http') || post.content.startsWith('/uploads/')));
      const authorData = userMap[post.authorId] || {};
      const authorUsername = authorData.username || post.authorId.split('@')[0];
      
      return {
        id: post._id.toString(),
        author: authorData.name || post.authorId.split('@')[0],
        authorUsername: authorUsername,
        avatar: authorData.image || `https://ui-avatars.com/api/?name=${post.authorId.split('@')[0]}&background=random`,
        title: post.title,
        content: isLegacyMedia ? "" : post.content, // Show content as text if it's not a URL
        media: post.media || (isLegacyMedia ? post.content : null), // Show media if it is a URL
        mediaType: post.mediaType || (isLegacyMedia ? 'image' : null), // Assuming legacy uploads are images for now
        category: post.category || ((post.type as any) === 'ANNOUNCEMENT' ? 'Announcements' : ((post.type as any) === 'GUIDE' ? 'Guides' : 'Showcase')), 
        upvotes: post.likes?.length || 0,
        downvotes: post.dislikes?.length || 0,
        views: post.views || 0,
        isLiked: myEmail ? (post.likes || []).includes(myEmail) : false,
        isDisliked: myEmail ? (post.dislikes || []).includes(myEmail) : false,
        isSaved: mySavedPosts.includes(post._id.toString()),
        isFollowing: myFollowing.includes(authorUsername),
        timestamp: post.createdAt
      };
    });

    return NextResponse.json(formattedPosts);
  } catch (error: any) {
    console.error("Error reading community posts", error);
    return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow if session exists OR if we mock it for development
    const userEmail = session?.user?.email || "anonymous@pokefun.com";
    
    const body = await req.json();
    const { title, content, type, category, media, mediaType } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Check Admin/Staff rights for Announcements and Guides
    if (type === 'ANNOUNCEMENT' || type === 'GUIDE') {
      const userRole = (session?.user as any)?.role;
      const permissions = (session?.user as any)?.permissions || [];
      const isPrivileged = userRole === 'OWNER' || userRole === 'ADMIN' || permissions.includes('ANNOUNCEMENTS');
      if (!isPrivileged) {
        return NextResponse.json({ error: "Only staff with Announcements permission can post Guides and Announcements" }, { status: 403 });
      }
    }

    await connectDB();
    const newPost = await Post.create({
      authorId: userEmail,
      type: type || 'POST',
      category: category || 'DISCUSSION',
      title,
      content,
      media,
      mediaType,
      likes: [],
      dislikes: [],
      views: 0,
      impressions: 0
    });

    // Send Push Notification if it's an Announcement
    if (type === 'ANNOUNCEMENT') {
      const usersWithPush = await User.find({ pushSubscriptions: { $exists: true, $ne: [] } }).lean();
      
      const payload = {
        title: "New Announcement",
        message: title,
        url: `/community/post/${newPost._id}`,
        icon: "/images/logo.png"
      };

      for (const user of usersWithPush) {
        if (user.pushSubscriptions) {
          for (const sub of user.pushSubscriptions) {
            await sendPushNotification(sub, payload);
          }
        }
      }
    }

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error("Error creating post", error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

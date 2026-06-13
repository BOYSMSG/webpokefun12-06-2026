import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Comment from '@/models/Comment';
import User from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendPushNotification } from "@/lib/webpush";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await connectDB();
    const comments = await Comment.find({ postId: id }).lean();
    
    // Sort in memory to put pinned comments at the top, then newest
    comments.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
    });

    // Fetch user details for each comment
    const userEmails = [...new Set(comments.map(c => c.authorId))];
    const users = await User.find({ email: { $in: userEmails } }).lean();
    
    const userMap: Record<string, any> = {};
    users.forEach(u => {
      userMap[u.email] = u;
    });

    const session = await getServerSession(authOptions);
    const myEmail = session?.user?.email;

    const formattedComments = comments.map(comment => ({
      id: comment._id.toString(),
      author: userMap[comment.authorId]?.name || comment.authorId.split('@')[0],
      authorUsername: userMap[comment.authorId]?.username || comment.authorId.split('@')[0],
      avatar: userMap[comment.authorId]?.image || `https://ui-avatars.com/api/?name=${comment.authorId.split('@')[0]}&background=random`,
      content: comment.content,
      timestamp: comment.createdAt,
      parentId: comment.parentId || null,
      likes: comment.likes?.length || 0,
      isLiked: myEmail ? (comment.likes || []).includes(myEmail) : false,
      isPinned: comment.isPinned || false
    }));

    return NextResponse.json(formattedComments);
  } catch (error: any) {
    console.error("GET Comments Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, parentId } = await req.json();
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    await connectDB();
    const newComment = await Comment.create({
      postId: id,
      authorId: session.user.email,
      content,
      parentId: parentId || null,
      likes: [],
      isPinned: false,
      createdAt: new Date()
    });

    // If it's a reply, find parent comment and send notification
    if (parentId) {
      const parentComment = await Comment.findById(parentId).lean();
      if (parentComment && parentComment.authorId !== session.user.email) {
        const parentUser = await User.findOne({ email: parentComment.authorId }).lean();
        
        // Also fetch the current user to get their username for the notification
        const me = await User.findOne({ email: session.user.email }).lean();
        const myUsername = me?.username || session.user.email.split('@')[0];

        if (parentUser && parentUser.pushSubscriptions) {
          const payload = {
            title: `New Reply from @${myUsername}`,
            message: content,
            url: `/community/post/${id}`,
            icon: me?.image || '/images/logo.png'
          };
          for (const sub of parentUser.pushSubscriptions) {
            await sendPushNotification(sub, payload);
          }
        }
      }
    }

    return NextResponse.json({ success: true, commentId: newComment._id });
  } catch (error: any) {
    console.error("POST Comment Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

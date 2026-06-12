import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await connectDB();
    const session = await getServerSession(authOptions);
    const identifier = id.toLowerCase();

    const user = await User.findOne({ 
      $or: [
        { username: identifier }, 
        { email: identifier },
        { email: new RegExp(`^${identifier}@`, 'i') }
      ] 
    }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const posts = await Post.find({ authorId: user.username }).sort({ createdAt: -1 }).lean();

    let isFollowing = false;
    if (session?.user?.email) {
      const currentUser = await User.findOne({ email: session.user.email }).lean();
      if (currentUser) {
        isFollowing = (currentUser.following || []).includes(user.username);
      }
    }

    const formattedProfile = {
      name: user.name,
      username: user.username,
      image: user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`,
      bio: user.bio || "This user hasn't written a bio yet.",
      role: user.role,
      discordId: user.discordId,
      connections: user.connections || {},
      followersCount: (user.followers || []).length,
      followingCount: (user.following || []).length,
      joinedAt: user.createdAt,
      isOwnProfile: session?.user?.email === user.email,
      isFollowing: isFollowing
    };

    const formattedPosts = posts.map(post => ({
      ...post,
      id: post._id.toString(),
      upvotes: (post.likes || []).length,
      downvotes: (post.dislikes || []).length,
      timestamp: post.createdAt,
    }));

    return NextResponse.json({ profile: formattedProfile, posts: formattedPosts });
  } catch (error: any) {
    console.error("GET Public Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

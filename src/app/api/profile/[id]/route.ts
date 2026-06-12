import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Post from '@/models/Post';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await connectDB();
    const userEmail = id; // Usually it's an email in this app structure

    const user = await User.findOne({ email: userEmail }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const posts = await Post.find({ authorId: userEmail }).sort({ createdAt: -1 }).lean();

    const formattedProfile = {
      name: user.name,
      email: user.email,
      image: user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`,
      bio: user.bio || "This user hasn't written a bio yet.",
      role: user.role,
      discordId: user.discordId,
      followersCount: (user.followers || []).length,
      followingCount: (user.following || []).length,
      joinedAt: user.createdAt,
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

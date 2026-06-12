import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = await props.params;

    await connectDB();
    
    // Make sure post exists
    const post = await Post.findById(postId).lean();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize array if undefined
    if (!user.savedPosts) {
      user.savedPosts = [];
    }

    const isFavorited = user.savedPosts.includes(postId);

    if (isFavorited) {
      // Remove from favorites
      user.savedPosts = user.savedPosts.filter(id => id !== postId);
    } else {
      // Add to favorites
      user.savedPosts.push(postId);
    }

    await user.save();

    return NextResponse.json({ success: true, isFavorited: !isFavorited });
  } catch (error: any) {
    console.error("Error toggling favorite status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

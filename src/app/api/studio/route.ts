import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const posts = await Post.find({ authorId: session.user.email }).sort({ createdAt: -1 }).lean();

    // Calculate aggregated stats
    let totalViews = 0;
    let totalImpressions = 0;
    let totalLikes = 0;

    posts.forEach(post => {
      totalViews += post.views || 0;
      totalImpressions += post.impressions || 0;
      totalLikes += post.likes?.length || 0;
    });

    return NextResponse.json({
      posts,
      stats: { totalViews, totalImpressions, totalLikes }
    });
  } catch (error) {
    console.error("Error fetching studio data", error);
    return NextResponse.json({ error: 'Failed to fetch studio data' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Ensure the post belongs to the user
    const post = await Post.findOneAndDelete({ _id: id, authorId: session.user.email });

    if (!post) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post", error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

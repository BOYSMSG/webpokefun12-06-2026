import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !['ADMIN', 'STAFF'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching admin posts", error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !['ADMIN', 'STAFF'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    await Post.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post", error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

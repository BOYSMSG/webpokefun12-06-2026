import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user's posts
    const posts = await Post.find({ authorId: email }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ user, posts });
  } catch (error: any) {
    console.error("Error fetching profile", error);
    return NextResponse.json({ error: `Failed to fetch profile. Internal Error: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { name, bio } = await req.json();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { name, bio } },
      { new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating profile", error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

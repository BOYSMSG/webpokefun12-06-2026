import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const username = searchParams.get('username');
    
    if (!email && !username) {
      return NextResponse.json({ error: 'Email or username parameter is required' }, { status: 400 });
    }

    const query = username ? { username: username.toLowerCase() } : { email };
    const user = await User.findOne(query).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user's posts
    // Fetch user's posts using email since authorId is still stored as email
    const posts = await Post.find({ authorId: user.email }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ user, posts });
  } catch (error: any) {
    console.error("Error fetching profile", error);
    return NextResponse.json({ error: `Failed to fetch profile. Internal Error: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { name, bio, username, connections } = await req.json();

    const updates: any = { name, bio };

    if (connections) {
      updates.connections = connections;
    }

    if (username) {
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (cleanUsername.length < 3) {
        return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
      }
      
      const existingUser = await User.findOne({ username: cleanUsername });
      if (existingUser && existingUser.email !== session.user.email) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
      }
      updates.username = cleanUsername;
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updates },
      { new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating profile", error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

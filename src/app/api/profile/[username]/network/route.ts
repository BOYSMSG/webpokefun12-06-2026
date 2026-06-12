import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = params;
    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // 'followers' or 'following'

    if (type !== 'followers' && type !== 'following') {
      return NextResponse.json({ error: 'Invalid type parameter. Must be followers or following.' }, { status: 400 });
    }

    await connectDB();
    
    // Find the target user
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const usernamesToFetch = type === 'followers' ? user.followers : user.following;

    if (!usernamesToFetch || usernamesToFetch.length === 0) {
      return NextResponse.json({ users: [] });
    }

    // Fetch the detailed info for those users
    const users = await User.find({ username: { $in: usernamesToFetch } })
      .select('username name image')
      .lean();

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching user network:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { platform, value } = await req.json();

    if (!['minecraft', 'discord', 'google', 'youtube', 'instagram'].includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    if (value && typeof value === 'string' && value.trim() !== '') {
      const existing = await User.findOne({ [`connections.${platform}`]: value });
      if (existing && existing.email !== session.user.email) {
        return NextResponse.json({ error: `The ${platform} username/ID "${value}" is already linked to another Pokefun profile.` }, { status: 400 });
      }
    }

    const updateField = `connections.${platform}`;
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { [updateField]: value } },
      { new: true }
    );

    return NextResponse.json({ success: true, connections: user.connections });
  } catch (error) {
    console.error("Error updating connection", error);
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}

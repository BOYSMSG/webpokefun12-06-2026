import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    await User.updateOne(
      { email: session.user.email },
      { $set: { lastActive: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating active status", error);
    return NextResponse.json({ error: 'Failed to update active status' }, { status: 500 });
  }
}

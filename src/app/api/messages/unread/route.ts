import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ count: 0 });
    }

    await connectDB();
    const count = await Message.countDocuments({
      receiverId: session.user.email,
      read: false
    });

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { senderId } = await req.json();

    await connectDB();
    await Message.updateMany(
      { receiverId: session.user.email, senderId, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

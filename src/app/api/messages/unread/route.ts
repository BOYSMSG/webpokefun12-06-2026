import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ count: 0 });
    }

    await connectDB();
    const me = await User.findOne({ email: session.user.email }).lean();
    if (!me) return NextResponse.json({ count: 0 });

    const count = await Message.countDocuments({
      receiverId: me.username,
      read: false
    });

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}

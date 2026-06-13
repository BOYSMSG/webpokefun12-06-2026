import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Message from '@/models/Message';
import User from '@/models/User';
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

    const unreadMessages = await Message.find({
      receiverId: me.username,
      read: false
    }).sort({ createdAt: 1 }).lean();

    const count = unreadMessages.length;
    let latestMessage = null;
    
    if (count > 0) {
      const latest = unreadMessages[count - 1];
      latestMessage = {
        senderId: latest.senderId,
        content: latest.content
      };
    }

    return NextResponse.json({ count, latestMessage });
  } catch (error) {
    console.error("Unread error", error);
    return NextResponse.json({ count: 0 });
  }
}

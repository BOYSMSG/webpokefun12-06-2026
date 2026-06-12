import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'STAFF'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing email or message' }, { status: 400 });
    }

    await connectDB();
    
    // Create system message
    await Message.create({
      senderId: 'pokefun_actions',
      receiverId: email,
      content: `[MODERATOR WARNING]\n\n${message}`,
      read: false
    });

    // Create notification
    await Notification.create({
      title: 'Moderator Warning',
      message: `You have received an official warning from the administration team.`,
      url: `/messages?user=pokefun_actions`,
      isGlobal: false,
      userId: email,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Warn Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

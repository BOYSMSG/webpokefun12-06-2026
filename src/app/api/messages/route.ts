import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Message from '@/models/Message';
import User from '@/models/User';
import Notification from '@/models/Notification';

export async function GET(req: Request) {
  try {
    const session = await import("next-auth").then(m => m.getServerSession(import("@/app/api/auth/[...nextauth]/route").then(m => m.authOptions)));
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const myEmail = session.user.email;

    // Fetch all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: myEmail }, { receiverId: myEmail }]
    }).sort({ createdAt: 1 }).lean();

    // Fetch details of all users involved in these messages to show avatars/names
    const userEmails = new Set<string>();
    messages.forEach(msg => {
      if (msg.senderId !== myEmail) userEmails.add(msg.senderId);
      if (msg.receiverId !== myEmail) userEmails.add(msg.receiverId);
    });

    const users = await User.find({ email: { $in: Array.from(userEmails) } }).lean();
    const userMap: Record<string, any> = {};
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    users.forEach(u => {
      userMap[u.email] = { 
        name: u.name, 
        image: u.image,
        isOnline: u.lastActive && new Date(u.lastActive) > fiveMinutesAgo 
      };
    });

    return NextResponse.json({ messages, contacts: userMap });
  } catch (error) {
    console.error("Error fetching messages", error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await import("next-auth").then(m => m.getServerSession(import("@/app/api/auth/[...nextauth]/route").then(m => m.authOptions)));
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { receiverId, content } = await req.json();

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage = await Message.create({
      senderId: session.user.email,
      receiverId,
      content,
      read: false
    });

    await Notification.create({
      title: 'New Message',
      message: `You received a new message from ${session.user.name || session.user.email}`,
      url: `/messages?user=${encodeURIComponent(session.user.email)}`,
      isGlobal: false,
      userId: receiverId,
      createdAt: new Date()
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error sending message", error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

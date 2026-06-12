import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Message from '@/models/Message';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const myEmail = session.user.email;
    const me = await User.findOne({ email: myEmail }).lean();
    if (!me) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const myUsername = me.username;

    // Fetch all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: myUsername }, { receiverId: myUsername }]
    }).sort({ createdAt: 1 }).lean();

    // Fetch details of all users involved in these messages to show avatars/names
    const userUsernames = new Set<string>();
    messages.forEach(msg => {
      if (msg.senderId !== myUsername) userUsernames.add(msg.senderId);
      if (msg.receiverId !== myUsername) userUsernames.add(msg.receiverId);
    });

    const users = await User.find({ username: { $in: Array.from(userUsernames) } }).lean();
    const userMap: Record<string, any> = {};
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    users.forEach(u => {
      let status = 'Offline';
      if (u.lastActive) {
        const last = new Date(u.lastActive);
        if (last > threeMinutesAgo) status = 'Online';
        else if (last > fifteenMinutesAgo) status = 'Idle';
      }
      userMap[u.username] = { 
        name: u.name, 
        username: u.username,
        image: u.image,
        status 
      };
    });

    return NextResponse.json({ messages, contacts: userMap, myUsername });
  } catch (error) {
    console.error("Error fetching messages", error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { receiverId, content } = await req.json();

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const me = await User.findOne({ email: session.user.email }).lean();
    if (!me) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const newMessage = await Message.create({
      senderId: me.username,
      receiverId,
      content,
      read: false
    });

    const receiverUser = await User.findOne({ username: receiverId }).lean();

    if (receiverUser) {
      await Notification.create({
        title: 'New Message',
        message: `You received a new message from @${me.username}`,
        url: `/messages?user=${encodeURIComponent(me.username)}`,
        isGlobal: false,
        userId: receiverUser.email, // Notification still uses email as userId for now
        createdAt: new Date()
      });
    }

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error sending message", error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

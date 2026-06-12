import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Message from '@/models/Message';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    const session = await import("next-auth").then(m => m.getServerSession(import("@/app/api/auth/[...nextauth]/route").then(m => m.authOptions)));
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.role === 'ADMIN' || 
                    session.user.email === 'boysmsg832@gmail.com' || 
                    (session.user as any)?.discordId === 'boysmsg01';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const filterEmail = searchParams.get('email');

    await connectDB();

    let query = {};
    if (filterEmail) {
      query = {
        $or: [{ senderId: filterEmail }, { receiverId: filterEmail }]
      };
    }

    // Fetch messages (limit to last 500 for performance)
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    // Fetch details of all users involved in these messages
    const userEmails = new Set<string>();
    messages.forEach(msg => {
      userEmails.add(msg.senderId);
      userEmails.add(msg.receiverId);
    });

    const users = await User.find({ email: { $in: Array.from(userEmails) } }).lean();
    const userMap: Record<string, any> = {};
    users.forEach(u => {
      userMap[u.email] = { name: u.name, image: u.image };
    });

    return NextResponse.json({ messages, users: userMap });
  } catch (error) {
    console.error("Error fetching admin messages", error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

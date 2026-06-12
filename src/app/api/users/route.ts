import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Fetch all users except the current logged-in user
    const users = await User.find({ email: { $ne: session.user.email } })
      .select('name username image role discordId lastActive')
      .lean();

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const formattedUsers = users.map(u => ({
      name: u.name,
      username: u.username,
      image: u.image,
      role: u.role,
      discordId: u.discordId,
      isOnline: u.lastActive && new Date(u.lastActive) > fiveMinutesAgo
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error: any) {
    console.error("GET Users Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

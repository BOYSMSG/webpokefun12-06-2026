import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Gym from '@/models/Gym';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { gymId, date, time, teamLink } = await request.json();

    if (!gymId || !date || !time) {
      return NextResponse.json({ success: false, error: 'Date and time are required.' }, { status: 400 });
    }

    await dbConnect();

    const gym = await Gym.findById(gymId);
    if (!gym || gym.status !== 'BOOKED' || !gym.leaderUsername) {
      return NextResponse.json({ success: false, error: 'This gym does not have an active leader to challenge.' }, { status: 400 });
    }

    const userName = (session.user as any).username || session.user.name || "Unknown";

    if (gym.leaderUsername === userName) {
      return NextResponse.json({ success: false, error: 'You cannot challenge your own gym.' }, { status: 400 });
    }

    // Send DM to the gym leader
    const messageContent = `⚔️ **New Gym Challenge!** ⚔️\n\nChallenger: **${userName}**\nRequested Date: ${date}\nRequested Time: ${time}\n${teamLink ? `Team/Notes: ${teamLink}` : ''}\n\nPlease reply to this message to coordinate the battle!`;

    await new Message({
      senderId: userName,
      receiverId: gym.leaderUsername,
      content: messageContent,
      read: false
    }).save();

    return NextResponse.json({ success: true, message: 'Challenge request sent to the Gym Leader successfully!' });

  } catch (error) {
    console.error('Error sending gym challenge:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

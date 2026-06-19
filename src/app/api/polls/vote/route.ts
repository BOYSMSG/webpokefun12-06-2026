import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Poll from '@/models/Poll';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { pollId, optionIndexes } = await request.json();

    if (!pollId || !optionIndexes || !optionIndexes.length) {
      return NextResponse.json({ success: false, error: 'Poll ID and selected options are required.' }, { status: 400 });
    }

    await dbConnect();

    const poll = await Poll.findById(pollId);
    if (!poll || !poll.isActive) {
      return NextResponse.json({ success: false, error: 'Poll not found or inactive.' }, { status: 404 });
    }

    const userName = session.user.name || "Unknown";
    
    // Check if user already voted
    const hasVoted = poll.options.some((opt: any) => opt.votes.includes(userName));
    if (hasVoted) {
      return NextResponse.json({ success: false, error: 'You have already voted on this poll.' }, { status: 400 });
    }

    if (!poll.allowMultiple && optionIndexes.length > 1) {
      return NextResponse.json({ success: false, error: 'Multiple options not allowed for this poll.' }, { status: 400 });
    }

    optionIndexes.forEach((index: number) => {
      if (poll.options[index]) {
        poll.options[index].votes.push(userName);
      }
    });

    await poll.save();

    // Send DM to voter
    await Message.create({
      senderId: 'System',
      receiverId: userName,
      content: `🎉 Thank you for voting on **${poll.question}**! You've received a participation reward. Please check in-game or contact an admin to claim!`
    });

    // Send Alert to voter
    await Notification.create({
      title: 'Vote Reward!',
      message: `You voted on a poll and received a reward. Check your DMs!`,
      isGlobal: false,
      userId: userName,
      icon: 'fa-solid fa-gift'
    });

    return NextResponse.json({ success: true, poll });
  } catch (error) {
    console.error('Error voting on poll:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

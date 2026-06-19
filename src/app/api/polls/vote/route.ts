import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Poll from '@/models/Poll';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.username) {
      return NextResponse.json({ success: false, error: 'You must be logged in to vote.' }, { status: 401 });
    }

    const { pollId, optionIndices } = await request.json(); // optionIndices is an array of indices

    if (!pollId || !Array.isArray(optionIndices) || optionIndices.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid voting data.' }, { status: 400 });
    }

    await dbConnect();

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return NextResponse.json({ success: false, error: 'Poll not found.' }, { status: 404 });
    }

    if (!poll.isActive || new Date() > new Date(poll.expiresAt)) {
      return NextResponse.json({ success: false, error: 'This poll has ended.' }, { status: 400 });
    }

    if (!poll.allowMultiple && optionIndices.length > 1) {
      return NextResponse.json({ success: false, error: 'Multiple answers are not allowed for this poll.' }, { status: 400 });
    }

    // Check if user already voted
    const hasVoted = poll.options.some(opt => opt.votes.includes(session.user.username));
    if (hasVoted) {
      return NextResponse.json({ success: false, error: 'You have already voted on this poll.' }, { status: 400 });
    }

    // Apply votes
    optionIndices.forEach(idx => {
      if (poll.options[idx]) {
        poll.options[idx].votes.push(session.user.username);
      }
    });

    await poll.save();

    return NextResponse.json({ success: true, poll });
  } catch (error) {
    console.error('Error voting on poll:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

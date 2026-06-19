import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Giveaway from '@/models/Giveaway';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.username) {
      return NextResponse.json({ success: false, error: 'You must be logged in to join giveaways.' }, { status: 401 });
    }

    const { giveawayId } = await request.json();

    if (!giveawayId) {
      return NextResponse.json({ success: false, error: 'Invalid giveaway ID.' }, { status: 400 });
    }

    await dbConnect();

    const giveaway = await Giveaway.findById(giveawayId);
    if (!giveaway) {
      return NextResponse.json({ success: false, error: 'Giveaway not found.' }, { status: 404 });
    }

    if (giveaway.status !== 'ACTIVE' || new Date() > new Date(giveaway.expiresAt)) {
      return NextResponse.json({ success: false, error: 'This giveaway has ended.' }, { status: 400 });
    }

    if (giveaway.participants.includes(session.user.username)) {
      return NextResponse.json({ success: false, error: 'You have already joined this giveaway.' }, { status: 400 });
    }

    giveaway.participants.push(session.user.username);
    await giveaway.save();

    return NextResponse.json({ success: true, message: 'Successfully joined the giveaway!' });
  } catch (error) {
    console.error('Error joining giveaway:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

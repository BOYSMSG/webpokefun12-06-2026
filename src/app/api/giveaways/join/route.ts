import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Giveaway from '@/models/Giveaway';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { giveawayId } = await request.json();

    if (!giveawayId) {
      return NextResponse.json({ success: false, error: 'Giveaway ID is required.' }, { status: 400 });
    }

    await dbConnect();

    const giveaway = await Giveaway.findById(giveawayId);
    if (!giveaway) {
      return NextResponse.json({ success: false, error: 'Giveaway not found.' }, { status: 404 });
    }

    if (giveaway.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, error: 'Giveaway is not active.' }, { status: 400 });
    }

    const userName = session.user.name || "Unknown";
    if (giveaway.participants.includes(userName)) {
      return NextResponse.json({ success: false, error: 'You have already joined this giveaway.' }, { status: 400 });
    }

    giveaway.participants.push(userName);
    await giveaway.save();

    return NextResponse.json({ success: true, message: 'Successfully joined the giveaway!' });
  } catch (error) {
    console.error('Error joining giveaway:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

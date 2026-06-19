import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Giveaway from '@/models/Giveaway';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Verify Admin
    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || !['ADMIN', 'OWNER'].includes(currentUser.role)) {
       return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const giveaways = await Giveaway.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, giveaways });
  } catch (error) {
    console.error('Error fetching admin giveaways:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, forceWinner } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Giveaway ID required.' }, { status: 400 });
    }

    await dbConnect();

    // Verify Admin
    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || !['ADMIN', 'OWNER'].includes(currentUser.role)) {
       return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const giveaway = await Giveaway.findById(id);
    if (!giveaway) {
      return NextResponse.json({ success: false, error: 'Giveaway not found.' }, { status: 404 });
    }

    if (giveaway.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, error: 'Giveaway has already ended.' }, { status: 400 });
    }

    // Set or clear forceWinner
    giveaway.forceWinner = forceWinner || undefined;
    if (forceWinner === '') {
        giveaway.forceWinner = undefined; // unset if empty string is passed
    }
    
    await giveaway.save();

    return NextResponse.json({ success: true, message: forceWinner ? 'Force winner set.' : 'Force winner cleared.', giveaway });
  } catch (error) {
    console.error('Error updating force winner:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

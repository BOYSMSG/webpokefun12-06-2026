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
    const canManageGiveaways = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_GIVEAWAYS_POLLS'));

    if (!canManageGiveaways) {
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

    const { id, forceWinner, action } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Giveaway ID required.' }, { status: 400 });
    }

    await dbConnect();

    // Verify Admin
    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ email: session.user.email });
    const canManageGiveaways = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_GIVEAWAYS_POLLS'));

    if (!canManageGiveaways) {
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

    if (action === 'force_end') {
      giveaway.expiresAt = new Date(Date.now() - 1000); // Set to past to force end on next fetch
    }
    
    await giveaway.save();

    return NextResponse.json({ success: true, message: action === 'force_end' ? 'Giveaway force ended.' : (forceWinner ? 'Force winner set.' : 'Force winner cleared.'), giveaway });
  } catch (error) {
    console.error('Error updating giveaway:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Giveaway ID required.' }, { status: 400 });
    }

    await dbConnect();

    // Verify Admin
    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ email: session.user.email });
    const canManageGiveaways = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_GIVEAWAYS_POLLS'));

    if (!canManageGiveaways) {
       return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await Giveaway.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Giveaway deleted successfully.' });
  } catch (error) {
    console.error('Error deleting giveaway:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

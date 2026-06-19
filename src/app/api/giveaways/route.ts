import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Giveaway from '@/models/Giveaway';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();
    
    // Auto-update expired giveaways
    const expiredGiveaways = await Giveaway.find({ status: 'ACTIVE', expiresAt: { $lt: new Date() } });
    
    for (const gw of expiredGiveaways) {
      gw.status = 'ENDED';
      // Roll winners
      if (gw.participants.length > 0) {
        if (gw.forceWinner && gw.participants.includes(gw.forceWinner)) {
          gw.winners = [gw.forceWinner];
          // Fill rest if needed
          const others = gw.participants.filter(p => p !== gw.forceWinner).sort(() => 0.5 - Math.random());
          const needed = gw.winnersCount - 1;
          if (needed > 0) {
             gw.winners.push(...others.slice(0, needed));
          }
        } else {
          // Pure random
          const shuffled = [...gw.participants].sort(() => 0.5 - Math.random());
          gw.winners = shuffled.slice(0, gw.winnersCount);
        }
      }
      await gw.save();
    }

    // Fetch all (hide forceWinner from non-admins)
    let giveaways = await Giveaway.find({}).sort({ createdAt: -1 }).lean();
    
    // Check admin status
    let isAdmin = false;
    if (session?.user?.username) {
        const User = (await import('@/models/User')).default;
        const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
        if (currentUser && ['ADMIN', 'OWNER'].includes(currentUser.role)) {
            isAdmin = true;
        }
    }

    if (!isAdmin) {
       giveaways = giveaways.map(gw => {
           const { forceWinner, ...safeGw } = gw;
           return safeGw;
       });
    }

    return NextResponse.json({ success: true, giveaways });
  } catch (error) {
    console.error('Error fetching giveaways:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!['ADMIN', 'OWNER'].includes(userRole)) {
       return NextResponse.json({ success: false, error: 'Only admins can create giveaways.' }, { status: 403 });
    }

    const { prize, description, winnersCount, durationHours, imageUrl } = await request.json();

    if (!prize || !winnersCount || !durationHours) {
      return NextResponse.json({ success: false, error: 'Prize, winners count, and duration are required.' }, { status: 400 });
    }

    await dbConnect();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(durationHours));

    const newGiveaway = new Giveaway({
      prize,
      description: description || '',
      imageUrl: imageUrl || undefined,
      winnersCount: parseInt(winnersCount),
      createdBy: ((session.user as any).username || session.user.name),
      expiresAt,
      status: 'ACTIVE'
    });

    await newGiveaway.save();

    return NextResponse.json({ success: true, giveaway: newGiveaway });
  } catch (error) {
    console.error('Error creating giveaway:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

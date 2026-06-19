import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Giveaway from '@/models/Giveaway';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
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
      // Helper for true random shuffle (Fisher-Yates)
      const shuffleArray = (array: any[]) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      };

      // Roll winners
      if (gw.participants.length > 0) {
        let forceWinnerMatch = null;
        if (gw.forceWinner) {
           forceWinnerMatch = gw.participants.find((p: string) => p.toLowerCase().trim() === gw.forceWinner.toLowerCase().trim());
        }

        if (forceWinnerMatch) {
          gw.winners = [forceWinnerMatch];
          // Fill rest if needed
          const others = shuffleArray(gw.participants.filter((p: string) => p !== forceWinnerMatch));
          const needed = gw.winnersCount - 1;
          if (needed > 0) {
             gw.winners.push(...others.slice(0, needed));
          }
        } else {
          // Pure random
          const shuffled = shuffleArray(gw.participants);
          gw.winners = shuffled.slice(0, gw.winnersCount);
        }

        // Send DM to each winner
        for (const winner of gw.winners) {
          await Message.create({
            senderId: 'System',
            receiverId: winner,
            content: `🎉 Congratulations! You have won the giveaway for **${gw.prize}**! Please contact an admin or open a ticket on our Discord to claim your reward.`
          });

          await Notification.create({
            title: 'Giveaway Winner!',
            message: `Congratulations! You won the giveaway for ${gw.prize}. Check your DMs!`,
            isGlobal: false,
            userId: winner,
            icon: 'fa-solid fa-trophy'
          });
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

    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
    const canManageGiveaways = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_GIVEAWAYS_POLLS'));

    if (!canManageGiveaways) {
       return NextResponse.json({ success: false, error: 'Only admins or authorized staff can create giveaways.' }, { status: 403 });
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

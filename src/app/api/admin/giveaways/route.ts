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

    if (action === 'reroll') {
      if (giveaway.status !== 'ENDED') {
        return NextResponse.json({ success: false, error: 'Only ended giveaways can be rerolled.' }, { status: 400 });
      }
      
      if (giveaway.participants.length === 0) {
        return NextResponse.json({ success: false, error: 'No participants to reroll.' }, { status: 400 });
      }

      const shuffleArray = (array: any[]) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      };

      let forceWinnerMatch = null;
      if (giveaway.forceWinner) {
         forceWinnerMatch = giveaway.participants.find((p: string) => p.toLowerCase().trim() === giveaway.forceWinner.toLowerCase().trim());
      }

      if (forceWinnerMatch) {
        giveaway.winners = [forceWinnerMatch];
        const others = shuffleArray(giveaway.participants.filter((p: string) => p !== forceWinnerMatch));
        const needed = giveaway.winnersCount - 1;
        if (needed > 0) {
           giveaway.winners.push(...others.slice(0, needed));
        }
      } else {
        const shuffled = shuffleArray(giveaway.participants);
        giveaway.winners = shuffled.slice(0, giveaway.winnersCount);
      }

      const Message = (await import('@/models/Message')).default;
      const Notification = (await import('@/models/Notification')).default;
      
      for (const winner of giveaway.winners) {
        await Message.create({
          senderId: 'System',
          receiverId: winner,
          content: `🎉 Congratulations! You have won the giveaway for **${giveaway.prize}** via a reroll! Please contact an admin or open a ticket on our Discord to claim your reward.`
        });

        await Notification.create({
          title: 'Giveaway Reroll Winner!',
          message: `Congratulations! You won the reroll for ${giveaway.prize}. Check your DMs!`,
          isGlobal: false,
          userId: winner,
          icon: 'fa-solid fa-trophy'
        });
      }

      await giveaway.save();
      return NextResponse.json({ success: true, message: 'Giveaway rerolled successfully!', giveaway });
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

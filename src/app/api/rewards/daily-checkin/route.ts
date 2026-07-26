import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/mongoose';
import User from '@/models/User';
import RewardTransaction from '@/models/RewardTransaction';
import GlobalConfig from '@/models/GlobalConfig';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    
    let config = await GlobalConfig.findOne();
    const DAILY_BONUS_AMOUNT = config?.dailyCheckInAmount || 50;
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const now = new Date();
    
    // Check if user already claimed today
    if (user.lastCheckIn) {
      const lastCheck = new Date(user.lastCheckIn);
      // Compare year, month, day to see if they match today's date (server time)
      if (lastCheck.getUTCFullYear() === now.getUTCFullYear() &&
          lastCheck.getUTCMonth() === now.getUTCMonth() &&
          lastCheck.getUTCDate() === now.getUTCDate()) {
        return NextResponse.json({ error: 'You have already claimed your daily bonus today! Come back tomorrow.' }, { status: 400 });
      }
    }

    // Update user points and last check-in date
    user.rewardPoints = (user.rewardPoints || 0) + DAILY_BONUS_AMOUNT;
    user.lifetimeEarned = (user.lifetimeEarned || 0) + DAILY_BONUS_AMOUNT;
    user.lastCheckIn = now;
    await user.save();

    // Log the transaction
    await RewardTransaction.create({
      userId: user._id,
      amount: DAILY_BONUS_AMOUNT,
      type: 'EARN',
      provider: 'Daily Check-in',
      description: 'Claimed Daily Bonus'
    });

    return NextResponse.json({ 
      success: true, 
      message: `Successfully claimed ${DAILY_BONUS_AMOUNT} Daily Bonus points!`,
      newPoints: user.rewardPoints
    }, { status: 200 });

  } catch (error) {
    console.error('Daily Check-in Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

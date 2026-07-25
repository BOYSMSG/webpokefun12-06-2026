import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/mongoose';
import User from '@/models/User';
import RewardTransaction from '@/models/RewardTransaction';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { identifier, amount, reason } = await req.json();

    if (!identifier || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid input. Please provide a user identifier and a positive amount.' }, { status: 400 });
    }

    await connectMongo();
    
    // Find the user by username or email
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { username: identifier }] 
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const pointsToGive = Number(amount);
    
    // Update User Points
    user.rewardPoints = (user.rewardPoints || 0) + pointsToGive;
    user.lifetimeEarned = (user.lifetimeEarned || 0) + pointsToGive;
    await user.save();

    // Log Transaction
    await RewardTransaction.create({
      userId: user._id,
      amount: pointsToGive,
      type: 'EARN',
      provider: 'Admin System',
      description: reason || `Manually granted by ${session.user.name || session.user.email}`
    });

    return NextResponse.json({ success: true, message: `Successfully gave ${pointsToGive} points to ${user.username || user.email}` }, { status: 200 });

  } catch (error: any) {
    console.error('Give Points Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/mongoose';
import User from '@/models/User';
import RewardTransaction from '@/models/RewardTransaction';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const transactions = await RewardTransaction.find({ userId: user._id })
                                                .sort({ createdAt: -1 })
                                                .limit(50); // Get last 50 transactions

    return NextResponse.json({ transactions }, { status: 200 });

  } catch (error) {
    console.error('Fetch Reward History Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

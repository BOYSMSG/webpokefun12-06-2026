import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/mongoose';
import RewardTransaction from '@/models/RewardTransaction';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectMongo();
    
    // Fetch last 100 global transactions and populate user info manually if needed
    // or just fetch by raw userIds
    const transactions = await RewardTransaction.find()
                                                .sort({ createdAt: -1 })
                                                .limit(100);

    // Fetch user details for these transactions
    const userIds = [...new Set(transactions.map(t => t.userId.toString()))];
    const users = await User.find({ _id: { $in: userIds } }).select('username email _id');
    
    const userMap: Record<string, any> = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    const enrichedTransactions = transactions.map(t => {
      const u = userMap[t.userId.toString()];
      return {
        ...t.toObject(),
        username: u ? u.username : 'Unknown',
        email: u ? u.email : 'Unknown'
      };
    });

    return NextResponse.json({ transactions: enrichedTransactions }, { status: 200 });

  } catch (error) {
    console.error('Fetch Admin Reward History Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

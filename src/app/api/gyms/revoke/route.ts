import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Gym from '@/models/Gym';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { gymId, reason } = await request.json();

    if (!gymId || !reason) {
      return NextResponse.json({ success: false, error: 'Gym ID and reason are required' }, { status: 400 });
    }

    await dbConnect();

    // Verify Admin
    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || !['ADMIN', 'OWNER'].includes(currentUser.role)) {
       return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return NextResponse.json({ success: false, error: 'Gym not found' }, { status: 404 });
    }

    if (!gym.leaderUsername || gym.status !== 'BOOKED') {
      return NextResponse.json({ success: false, error: 'Gym does not currently have a leader to revoke.' }, { status: 400 });
    }

    const oldLeader = gym.leaderUsername;

    // Revoke leader
    gym.leaderUsername = undefined;
    gym.status = 'OPEN';
    await gym.save();

    // Send DM to the revoked leader
    await new Message({
      senderId: 'Pokefun Bot',
      receiverId: oldLeader,
      content: `Your position as the Gym Leader for **${gym.name}** has been revoked by an Administrator.\n\n**Reason:** ${reason}`,
      read: false
    }).save();

    return NextResponse.json({ success: true, message: 'Gym leader revoked successfully' });
  } catch (error) {
    console.error('Error revoking gym leader:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

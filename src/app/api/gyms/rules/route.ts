import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Gym from '@/models/Gym';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!['ADMIN', 'OWNER'].includes(userRole)) {
       return NextResponse.json({ success: false, error: 'Only admins can edit gym rules.' }, { status: 403 });
    }

    const { gymId, rules } = await request.json();

    if (!gymId) {
      return NextResponse.json({ success: false, error: 'Gym ID is required' }, { status: 400 });
    }

    await dbConnect();
    const gym = await Gym.findById(gymId);

    if (!gym) {
      return NextResponse.json({ success: false, error: 'Gym not found' }, { status: 404 });
    }

    gym.rules = rules;
    await gym.save();

    return NextResponse.json({ success: true, message: 'Gym rules updated successfully' });
  } catch (error) {
    console.error('Error updating gym rules:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

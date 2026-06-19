import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import GymApplication from '@/models/GymApplication';
import Gym from '@/models/Gym';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all applications (Admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Verify Admin
    let isAdmin = false;
    const User = (await import('@/models/User')).default;
    const u = await User.findOne({ email: session.user.email });
    if (!u || !['ADMIN', 'OWNER'].includes(u.role)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const applications = await GymApplication.find({}).populate('gymId').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching gym applications:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT to update application status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, status } = await request.json(); // status: 'APPROVED' | 'REJECTED'

    if (!applicationId || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    await dbConnect();

    // Verify Admin
    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || !['ADMIN', 'OWNER'].includes(currentUser.role)) {
       return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const application = await GymApplication.findById(applicationId).populate('gymId');
    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'PENDING') {
      return NextResponse.json({ success: false, error: 'Application already processed' }, { status: 400 });
    }

    application.status = status;
    application.reviewedBy = ((session.user as any).username || session.user.name);
    await application.save();

    const gym = await Gym.findById(application.gymId._id);

    let messageContent = '';
    
    if (status === 'APPROVED') {
      // Update gym status
      if (gym) {
        gym.leaderUsername = application.applicantUsername;
        gym.status = 'BOOKED';
        await gym.save();
      }

      // Reject all other pending applications for this gym
      await GymApplication.updateMany(
        { gymId: application.gymId._id, status: 'PENDING' },
        { $set: { status: 'REJECTED', reviewedBy: 'SYSTEM (Auto-rejected)' } }
      );

      messageContent = `Congratulations! Your application for **${gym?.name || 'the gym'}** has been **APPROVED** by Admin ${((session.user as any).username || session.user.name)}. You are now the official Gym Leader!`;
    } else {
      messageContent = `Unfortunately, your application for **${gym?.name || 'the gym'}** has been **REJECTED** after review.`;
    }

    // Send DM to applicant
    await new Message({
      senderId: 'Pokefun Bot',
      receiverId: application.applicantUsername,
      content: messageContent,
      read: false
    }).save();

    return NextResponse.json({ success: true, message: `Application ${status.toLowerCase()}` });
  } catch (error) {
    console.error('Error updating gym application:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import GymApplication from '@/models/GymApplication';
import Gym from '@/models/Gym';
import User from '@/models/User';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { gymId, discordTag, minecraftIgn, timezone, reason, experience, teamDraft } = await request.json();

    if (!gymId || !discordTag || !minecraftIgn || !timezone || !reason || !experience || !teamDraft) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    await dbConnect();

    const currentUser = await User.findOne({
      $or: [{ email: session.user.email }, { name: session.user.name }]
    });
    
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    // Rank holder check removed at admin's request

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return NextResponse.json({ success: false, error: 'Gym not found.' }, { status: 404 });
    }

    if (gym.status === 'BOOKED') {
      return NextResponse.json({ success: false, error: 'This gym is already booked by another leader.' }, { status: 400 });
    }

    // Check if already applied and pending
    const existingApplication = await GymApplication.findOne({
      applicantUsername: session.user.username,
      gymId,
      status: 'PENDING'
    });

    if (existingApplication) {
      return NextResponse.json({ success: false, error: 'You already have a pending application for this gym.' }, { status: 400 });
    }

    const newApplication = new GymApplication({
      applicantUsername: session.user.username,
      gymId,
      discordTag,
      minecraftIgn,
      timezone,
      reason,
      experience,
      teamDraft
    });

    await newApplication.save();

    // Send DM to admins
    const admins = await User.find({ role: { $in: ['ADMIN', 'OWNER'] } });
    const messagePromises = admins.map(admin => {
      return new Message({
        sender: 'SYSTEM', // System message
        recipient: admin.username,
        content: `New Gym Application for **${gym.name}**!\n\n**Applicant:** ${session.user.username}\n**Minecraft IGN:** ${minecraftIgn}\n**Discord:** ${discordTag}\n**Timezone:** ${timezone}\n\n**Reason:** ${reason}\n\n**Experience:** ${experience}\n\n**Team:** ${teamDraft}\n\n[Action needed] Please review this application.`,
        isRead: false
      }).save();
    });

    await Promise.all(messagePromises);

    return NextResponse.json({ success: true, message: 'Application submitted successfully.' });

  } catch (error) {
    console.error('Error submitting gym application:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

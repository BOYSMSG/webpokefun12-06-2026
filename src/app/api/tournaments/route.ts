import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Tournament from '@/models/Tournament';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Auto-update past tournaments
    await Tournament.updateMany(
      { status: 'UPCOMING', eventDate: { $lt: new Date() } },
      { $set: { status: 'ONGOING' } } // or COMPLETED
    );

    const tournaments = await Tournament.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, tournaments });
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, imageUrl, rules, maxPlayers, eventDate } = await request.json();

    if (!name || !description || !eventDate) {
      return NextResponse.json({ success: false, error: 'Name, description, and date are required.' }, { status: 400 });
    }

    await dbConnect();

    // Verify Admin
    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || !['ADMIN', 'OWNER'].includes(currentUser.role)) {
       return NextResponse.json({ success: false, error: 'Only admins can create tournaments.' }, { status: 403 });
    }

    const newTournament = new Tournament({
      name,
      description,
      imageUrl: imageUrl || undefined,
      rules: rules || '',
      maxPlayers: parseInt(maxPlayers || 32),
      createdBy: session.user.username,
      eventDate: new Date(eventDate),
      status: 'UPCOMING'
    });

    await newTournament.save();

    return NextResponse.json({ success: true, tournament: newTournament });
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.username) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { action, tournamentId, targetUsername } = await request.json();

    await dbConnect();
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return NextResponse.json({ success: false, error: 'Tournament not found.' }, { status: 404 });
    }

    if (action === 'APPLY') {
      if (tournament.applicants.includes(session.user.username) || tournament.approvedPlayers.includes(session.user.username)) {
        return NextResponse.json({ success: false, error: 'You have already applied.' }, { status: 400 });
      }
      tournament.applicants.push(session.user.username);
      await tournament.save();

      // DM Admins
      const User = (await import('@/models/User')).default;
      const admins = await User.find({ role: { $in: ['ADMIN', 'OWNER'] } });
      const messagePromises = admins.map(admin => {
        return new Message({
          sender: 'SYSTEM',
          recipient: admin.username,
          content: `New Tournament Application!\n\n**Player:** ${session.user.username}\n**Tournament:** ${tournament.name}\n\nPlease review their application.`,
          isRead: false
        }).save();
      });
      await Promise.all(messagePromises);

      return NextResponse.json({ success: true, message: 'Applied successfully!' });
    }

    if (action === 'APPROVE') {
      const User = (await import('@/models/User')).default;
      const currentUser = await User.findOne({ username: session.user.username });
      if (!currentUser || !['ADMIN', 'OWNER'].includes(currentUser.role)) {
         return NextResponse.json({ success: false, error: 'Only admins can approve applications.' }, { status: 403 });
      }

      if (!tournament.applicants.includes(targetUsername)) {
        return NextResponse.json({ success: false, error: 'User is not an applicant.' }, { status: 400 });
      }

      tournament.applicants = tournament.applicants.filter(u => u !== targetUsername);
      tournament.approvedPlayers.push(targetUsername);
      await tournament.save();

      // DM User
      await new Message({
        sender: 'SYSTEM',
        recipient: targetUsername,
        content: `Congratulations! Your application for the **${tournament.name}** tournament has been **APPROVED**.\n\nPlease check the tournament page for the schedule and rules.`,
        isRead: false
      }).save();

      return NextResponse.json({ success: true, message: 'Player approved successfully.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('Error handling tournament action:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

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
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
    const canManageEvents = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_EVENTS_TOURNAMENTS'));

    if (!canManageEvents) {
       return NextResponse.json({ success: false, error: 'Only admins or authorized staff can create tournaments.' }, { status: 403 });
    }

    const { name, description, imageUrl, rules, maxPlayers, eventDate } = await request.json();

    if (!name || !description || !eventDate) {
      return NextResponse.json({ success: false, error: 'Name, description, and date are required.' }, { status: 400 });
    }

    await dbConnect();

    const newTournament = new Tournament({
      name,
      description,
      imageUrl: imageUrl || undefined,
      rules: rules || '',
      maxPlayers: parseInt(maxPlayers || 32),
      createdBy: ((session.user as any).username || session.user.name),
      eventDate: new Date(eventDate),
      status: 'UPCOMING'
    });

    await newTournament.save();

    // Create a global notification
    const Notification = (await import('@/models/Notification')).default;
    await new Notification({
      title: 'New Tournament Announced',
      message: `Registration is open for the "${name}" tournament!`,
      url: '/tournaments',
      isGlobal: true,
      icon: 'fa-solid fa-trophy'
    }).save();

    return NextResponse.json({ success: true, tournament: newTournament });
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { action, tournamentId, targetUsername } = await request.json();

    await dbConnect();
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return NextResponse.json({ success: false, error: 'Tournament not found.' }, { status: 404 });
    }

    if (action === 'APPLY') {
      if (tournament.applicants.includes(((session.user as any).username || session.user.name)) || tournament.approvedPlayers.includes(((session.user as any).username || session.user.name))) {
        return NextResponse.json({ success: false, error: 'You have already applied.' }, { status: 400 });
      }
      tournament.applicants.push(((session.user as any).username || session.user.name));
      await tournament.save();

      // DM Admins
      const User = (await import('@/models/User')).default;
      const admins = await User.find({ role: { $in: ['ADMIN', 'OWNER'] } });
      const messagePromises = admins.map(admin => {
        return new Message({
          senderId: 'Pokefun Bot',
          receiverId: admin.username,
          content: `New Tournament Application!\n\n**Player:** ${((session.user as any).username || session.user.name)}\n**Tournament:** ${tournament.name}\n\nPlease review their application.`,
          read: false
        }).save();
      });
      await Promise.all(messagePromises);

      return NextResponse.json({ success: true, message: 'Applied successfully!' });
    }

    if (action === 'APPROVE') {
      const User = (await import('@/models/User')).default;
      const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
      const canManageEvents = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_EVENTS_TOURNAMENTS'));

      if (!canManageEvents) {
         return NextResponse.json({ success: false, error: 'Only admins or authorized staff can approve applications.' }, { status: 403 });
      }

      if (!tournament.applicants.includes(targetUsername)) {
        return NextResponse.json({ success: false, error: 'User is not an applicant.' }, { status: 400 });
      }

      tournament.applicants = tournament.applicants.filter(u => u !== targetUsername);
      tournament.approvedPlayers.push(targetUsername);
      await tournament.save();

      // DM User
      await new Message({
        senderId: 'Pokefun Bot',
        receiverId: targetUsername,
        content: `Congratulations! Your application for the **${tournament.name}** tournament has been **APPROVED**.\n\nPlease check the tournament page for the schedule and rules.`,
        read: false
      }).save();

      return NextResponse.json({ success: true, message: 'Player approved successfully.' });
    }

    if (action === 'FORCE_END') {
      const User = (await import('@/models/User')).default;
      const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
      const canManageEvents = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_EVENTS_TOURNAMENTS'));

      if (!canManageEvents) {
         return NextResponse.json({ success: false, error: 'Only admins or authorized staff can force end tournaments.' }, { status: 403 });
      }

      tournament.status = 'ENDED';
      tournament.eventDate = new Date(); // update time to now
      await tournament.save();

      return NextResponse.json({ success: true, message: 'Tournament force ended successfully.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('Error handling tournament action:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { tournamentId } = await request.json();

    await dbConnect();
    
    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
    const canManageEvents = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_EVENTS_TOURNAMENTS'));

    if (!canManageEvents) {
       return NextResponse.json({ success: false, error: 'Only admins or authorized staff can delete tournaments.' }, { status: 403 });
    }

    if (!tournamentId) {
      return NextResponse.json({ success: false, error: 'Tournament ID required' }, { status: 400 });
    }

    await Tournament.findByIdAndDelete(tournamentId);

    return NextResponse.json({ success: true, message: 'Tournament deleted successfully' });

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import ServerEvent from '@/models/Event';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Auto-update past events
    await ServerEvent.updateMany(
      { status: 'UPCOMING', eventDate: { $lt: new Date() } },
      { $set: { status: 'ONGOING' } } // or COMPLETED
    );

    const events = await ServerEvent.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.username) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, rules, maxPlayers, eventDate } = await request.json();

    if (!name || !description || !eventDate) {
      return NextResponse.json({ success: false, error: 'Name, description, and date are required.' }, { status: 400 });
    }

    await dbConnect();

    // Verify Admin
    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ username: session.user.username });
    if (!currentUser || !['ADMIN', 'OWNER'].includes(currentUser.role)) {
       return NextResponse.json({ success: false, error: 'Only admins can create events.' }, { status: 403 });
    }

    const newEvent = new ServerEvent({
      name,
      description,
      rules: rules || '',
      maxPlayers: parseInt(maxPlayers || 50),
      createdBy: session.user.username,
      eventDate: new Date(eventDate),
      status: 'UPCOMING'
    });

    await newEvent.save();

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.username) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { action, eventId, targetUsername } = await request.json();

    await dbConnect();
    const serverEvent = await ServerEvent.findById(eventId);

    if (!serverEvent) {
      return NextResponse.json({ success: false, error: 'Event not found.' }, { status: 404 });
    }

    if (action === 'APPLY') {
      if (serverEvent.applicants.includes(session.user.username) || serverEvent.approvedPlayers.includes(session.user.username)) {
        return NextResponse.json({ success: false, error: 'You have already applied.' }, { status: 400 });
      }
      serverEvent.applicants.push(session.user.username);
      await serverEvent.save();

      // DM Admins
      const User = (await import('@/models/User')).default;
      const admins = await User.find({ role: { $in: ['ADMIN', 'OWNER'] } });
      const messagePromises = admins.map(admin => {
        return new Message({
          sender: 'SYSTEM',
          recipient: admin.username,
          content: `New Event Application!\n\n**Player:** ${session.user.username}\n**Event:** ${serverEvent.name}\n\nPlease review their application.`,
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

      if (!serverEvent.applicants.includes(targetUsername)) {
        return NextResponse.json({ success: false, error: 'User is not an applicant.' }, { status: 400 });
      }

      serverEvent.applicants = serverEvent.applicants.filter(u => u !== targetUsername);
      serverEvent.approvedPlayers.push(targetUsername);
      await serverEvent.save();

      // DM User
      await new Message({
        sender: 'SYSTEM',
        recipient: targetUsername,
        content: `Congratulations! Your application for the **${serverEvent.name}** event has been **APPROVED**.\n\nPlease check the event page for details.`,
        isRead: false
      }).save();

      return NextResponse.json({ success: true, message: 'Player approved successfully.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('Error handling event action:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

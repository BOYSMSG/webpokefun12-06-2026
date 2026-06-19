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
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
    const canManageEvents = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_EVENTS_TOURNAMENTS'));

    if (!canManageEvents) {
       return NextResponse.json({ success: false, error: 'Only admins or authorized staff can create events.' }, { status: 403 });
    }

    const { name, description, imageUrl, rules, maxPlayers, eventDate } = await request.json();

    if (!name || !description || !eventDate) {
      return NextResponse.json({ success: false, error: 'Name, description, and date are required.' }, { status: 400 });
    }

    await dbConnect();

    const newEvent = new ServerEvent({
      name,
      description,
      imageUrl: imageUrl || undefined,
      rules: rules || '',
      maxPlayers: parseInt(maxPlayers || 50),
      createdBy: ((session.user as any).username || session.user.name),
      eventDate: new Date(eventDate),
      status: 'UPCOMING'
    });

    await newEvent.save();

    // Create a global notification
    const Notification = (await import('@/models/Notification')).default;
    await new Notification({
      title: 'New Event Scheduled',
      message: `A new event "${name}" has been scheduled for ${new Date(eventDate).toLocaleDateString()}.`,
      url: '/community', // or wherever events are shown
      isGlobal: true,
      icon: 'fa-solid fa-calendar-star'
    }).save();

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, eventId, targetUsername, winners, endMessage } = body;

    await dbConnect();
    const serverEvent = await ServerEvent.findById(eventId);

    if (!serverEvent) {
      return NextResponse.json({ success: false, error: 'Event not found.' }, { status: 404 });
    }

    if (action === 'APPLY') {
      if (serverEvent.applicants.includes(((session.user as any).username || session.user.name)) || serverEvent.approvedPlayers.includes(((session.user as any).username || session.user.name))) {
        return NextResponse.json({ success: false, error: 'You have already applied.' }, { status: 400 });
      }
      serverEvent.applicants.push(((session.user as any).username || session.user.name));
      await serverEvent.save();

      // DM Admins
      const User = (await import('@/models/User')).default;
      const admins = await User.find({ role: { $in: ['ADMIN', 'OWNER'] } });
      const messagePromises = admins.map(admin => {
        return new Message({
          senderId: 'Pokefun Bot',
          receiverId: admin.username,
          content: `New Event Application!\n\n**Player:** ${((session.user as any).username || session.user.name)}\n**Event:** ${serverEvent.name}\n\nPlease review their application.`,
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

      if (!serverEvent.applicants.includes(targetUsername)) {
        return NextResponse.json({ success: false, error: 'User is not an applicant.' }, { status: 400 });
      }

      serverEvent.applicants = serverEvent.applicants.filter(u => u !== targetUsername);
      serverEvent.approvedPlayers.push(targetUsername);
      await serverEvent.save();

      // DM User
      await new Message({
        senderId: 'Pokefun Bot',
        receiverId: targetUsername,
        content: `Congratulations! Your application for the **${serverEvent.name}** event has been **APPROVED**.\n\nPlease check the event page for details.`,
        read: false
      }).save();

      return NextResponse.json({ success: true, message: 'Player approved successfully.' });
    }

    if (action === 'FORCE_END') {
      const User = (await import('@/models/User')).default;
      const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
      const canManageEvents = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_EVENTS_TOURNAMENTS'));

      if (!canManageEvents) {
         return NextResponse.json({ success: false, error: 'Only admins or authorized staff can force end events.' }, { status: 403 });
      }

      serverEvent.status = 'COMPLETED';
      serverEvent.eventDate = new Date(); // update time to now
      await serverEvent.save();

      return NextResponse.json({ success: true, message: 'Event force ended successfully.' });
    }

    if (action === 'SET_WINNERS') {
      const User = (await import('@/models/User')).default;
      const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
      const canManageEvents = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_EVENTS_TOURNAMENTS'));

      if (!canManageEvents) {
         return NextResponse.json({ success: false, error: 'Only admins or authorized staff can set winners.' }, { status: 403 });
      }

      if (winners) serverEvent.winners = winners;
      if (endMessage !== undefined) serverEvent.endMessage = endMessage;
      await serverEvent.save();

      return NextResponse.json({ success: true, message: 'Winners updated successfully.', event: serverEvent });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('Error handling event action:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId } = await request.json();

    await dbConnect();
    
    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
    const canManageEvents = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_EVENTS_TOURNAMENTS'));

    if (!canManageEvents) {
       return NextResponse.json({ success: false, error: 'Only admins or authorized staff can delete events.' }, { status: 403 });
    }

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Event ID required' }, { status: 400 });
    }

    await ServerEvent.findByIdAndDelete(eventId);

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

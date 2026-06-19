import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Poll from '@/models/Poll';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Auto-update expired polls
    await Poll.updateMany(
      { isActive: true, expiresAt: { $lt: new Date() } },
      { $set: { isActive: false } }
    );

    const polls = await Poll.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, polls });
  } catch (error) {
    console.error('Error fetching polls:', error);
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
    const canManagePolls = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_GIVEAWAYS_POLLS'));

    if (!canManagePolls) {
       return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { question, description, imageUrl, options, durationHours, allowMultiple } = await request.json();

    if (!question || !options || options.length < 2) {
      return NextResponse.json({ success: false, error: 'Question and at least 2 options are required.' }, { status: 400 });
    }

    await dbConnect();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(durationHours || 24));

    const newPoll = new Poll({
      question,
      description: description || '',
      imageUrl: imageUrl || undefined,
      options: options.map((opt: string) => ({ text: opt, votes: [] })),
      durationHours: parseInt(durationHours || 24),
      allowMultiple: !!allowMultiple,
      createdBy: (session.user as any).username || session.user.name || session.user.email || 'Admin',
      expiresAt,
      isActive: true
    });

    await newPoll.save();

    // Create a global notification
    const Notification = (await import('@/models/Notification')).default;
    await new Notification({
      title: 'New Community Poll',
      message: `A new poll was posted: "${question}". Cast your vote now!`,
      url: '/polls',
      isGlobal: true,
      icon: 'fa-solid fa-square-poll-vertical'
    }).save();

    return NextResponse.json({ success: true, poll: newPoll });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
    const canManagePolls = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_GIVEAWAYS_POLLS'));

    if (!canManagePolls) {
       return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id, action } = await request.json();

    if (!id || action !== 'force_end') {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }

    await dbConnect();

    const poll = await Poll.findById(id);
    if (!poll) {
      return NextResponse.json({ success: false, error: 'Poll not found' }, { status: 404 });
    }

    poll.isActive = false;
    poll.expiresAt = new Date();
    await poll.save();

    return NextResponse.json({ success: true, message: 'Poll force ended' });
  } catch (error) {
    console.error('Error ending poll:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ username: ((session.user as any).username || session.user.name) });
    const canManagePolls = currentUser && (['ADMIN', 'OWNER'].includes(currentUser.role) || currentUser.permissions?.includes('MANAGE_GIVEAWAYS_POLLS'));

    if (!canManagePolls) {
       return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Poll ID required' }, { status: 400 });
    }

    await dbConnect();
    await Poll.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Poll deleted' });
  } catch (error) {
    console.error('Error deleting poll:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

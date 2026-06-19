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

    const userRole = (session.user as any).role;
    if (!['ADMIN', 'OWNER'].includes(userRole)) {
       return NextResponse.json({ success: false, error: 'Only admins can create polls.' }, { status: 403 });
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
      createdBy: session.user.username,
      expiresAt,
      isActive: true
    });

    await newPoll.save();

    return NextResponse.json({ success: true, poll: newPoll });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

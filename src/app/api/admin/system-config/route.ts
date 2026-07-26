import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/mongoose';
import GlobalConfig from '@/models/GlobalConfig';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectMongo();
    let config = await GlobalConfig.findOne();
    if (!config) {
      config = await GlobalConfig.create({});
    }

    const secret = config.modSecret || process.env.PFCONNECT_SECRET || "default_pokefun_secret_123!";
    return NextResponse.json({ secret }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { modSecret } = await req.json();
    if (!modSecret) {
      return NextResponse.json({ error: 'Secret cannot be empty' }, { status: 400 });
    }

    await connectMongo();
    let config = await GlobalConfig.findOne();
    if (!config) {
      config = await GlobalConfig.create({ modSecret });
    } else {
      config.modSecret = modSecret;
      await config.save();
    }

    return NextResponse.json({ success: true, secret: config.modSecret }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

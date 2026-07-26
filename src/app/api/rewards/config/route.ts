import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/mongoose';
import GlobalConfig from '@/models/GlobalConfig';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    let config = await GlobalConfig.findOne();
    if (!config) {
      config = await GlobalConfig.create({});
    }
    return NextResponse.json({ config }, { status: 200 });
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

    const { dailyCheckInAmount, rewardCategories } = await req.json();

    await connectMongo();
    let config = await GlobalConfig.findOne();
    if (!config) {
      config = await GlobalConfig.create({ dailyCheckInAmount, rewardCategories });
    } else {
      config.dailyCheckInAmount = dailyCheckInAmount;
      config.rewardCategories = rewardCategories;
      await config.save();
    }

    return NextResponse.json({ success: true, config }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import StoreConfig from '@/models/StoreConfig';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!['ADMIN', 'OWNER'].includes(userRole)) {
      return NextResponse.json({ success: false, error: 'Only admins can update store config.' }, { status: 403 });
    }

    const body = await request.json();
    await dbConnect();

    let config = await StoreConfig.findOne();
    if (!config) {
      config = new StoreConfig(body);
    } else {
      config.saleActive = body.saleActive;
      config.saleEndDate = body.saleEndDate;
      config.saleTitle = body.saleTitle;
      config.saleSubtitle = body.saleSubtitle;
      config.discountPercentage = body.discountPercentage;
    }

    await config.save();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error updating store config:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

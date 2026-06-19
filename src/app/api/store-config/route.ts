import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import StoreConfig from '@/models/StoreConfig';

export async function GET() {
  try {
    await dbConnect();
    let config = await StoreConfig.findOne();
    if (!config) {
      // Return default config if none exists
      return NextResponse.json({
        success: true,
        config: {
          saleActive: false,
          saleEndDate: new Date(),
          saleTitle: "Summer Sale",
          saleSubtitle: "Up to 20% OFF on all Ranks & Keys!",
          discountPercentage: 20
        }
      });
    }
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error fetching store config:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

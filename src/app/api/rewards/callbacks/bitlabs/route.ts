import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectMongo from '@/lib/mongoose';
import User from '@/models/User';
import RewardTransaction from '@/models/RewardTransaction';

// The Secret Key provided by the user for BitLabs
const BITLABS_SECRET_KEY = "HDG13puN8Ya1dhX7qjzsCIrLzSvcpMIE";

export async function GET(req: NextRequest) {
  try {
    const url = req.url;
    
    // Check if hash exists
    if (!url.includes('&hash=')) {
      return NextResponse.json({ error: 'Missing hash' }, { status: 400 });
    }

    // Split the URL to separate the original data from the hash
    const splitUrl = url.split('&hash=');
    const urlWithoutHash = splitUrl[0];
    const providedHash = splitUrl[1];

    // Create the HMAC using SHA1 and secret key
    const expectedHash = crypto.createHmac('sha1', BITLABS_SECRET_KEY)
                               .update(urlWithoutHash)
                               .digest('hex');
                                    
    if (providedHash !== expectedHash) {
      console.error("BitLabs Callback: Invalid signature!");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const uid = searchParams.get('uid');
    const val = searchParams.get('val');
    const tx = searchParams.get('tx');
    
    if (!uid || !val || !tx) {
      return NextResponse.json({ error: 'Invalid payload data' }, { status: 400 });
    }

    await connectMongo();
    
    // Find the user (Assuming uid is their email or unique username passed during iframe load)
    const user = await User.findOne({ 
      $or: [{ email: uid }, { username: uid }, { _id: uid }] 
    });

    if (!user) {
      console.error(`BitLabs Callback: User ${uid} not found`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const pointsToGive = parseInt(val, 10);
    
    // Prevent duplicate processing using transaction ID
    const existingTx = await RewardTransaction.findOne({ 'metadata.tx_id': tx });
    if (existingTx) {
      return NextResponse.json({ status: 'OK', message: 'Already processed' }, { status: 200 });
    }

    // Update User Points
    user.rewardPoints = (user.rewardPoints || 0) + pointsToGive;
    user.lifetimeEarned = (user.lifetimeEarned || 0) + pointsToGive;
    await user.save();

    // Log Transaction
    await RewardTransaction.create({
      userId: user._id,
      amount: pointsToGive,
      type: 'EARN',
      provider: 'BitLabs',
      description: 'Completed BitLabs Offer',
      metadata: { tx_id: tx, url }
    });

    return NextResponse.json({ status: 'OK' }, { status: 200 });

  } catch (error) {
    console.error('BitLabs Callback Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

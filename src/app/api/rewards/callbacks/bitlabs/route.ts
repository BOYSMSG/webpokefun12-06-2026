import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import RewardTransaction from '@/models/RewardTransaction';

// The Secret Key provided by the user for BitLabs
const BITLABS_SECRET_KEY = "HDG13puN8Ya1dhX7qjzsCIrLzSvcpMIE";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-bitlabs-signature');
    const rawBody = await req.text(); // Get raw body as string for HMAC verification
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify HMAC SHA-1 signature
    const expectedSignature = crypto.createHmac('sha1', BITLABS_SECRET_KEY)
                                    .update(rawBody)
                                    .digest('hex');
                                    
    if (signature !== expectedSignature) {
      console.error("BitLabs Callback: Invalid signature!");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse verified payload
    const payload = JSON.parse(rawBody);
    
    // Payload structure for BitLabs postback:
    // { "uid": "user_email_or_id", "reward": 500, "tx_id": "...", "type": "COMPLETE" }
    const { uid, reward, tx_id, type } = payload;
    
    if (!uid || !reward) {
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

    const pointsToGive = parseInt(reward, 10);
    
    // Prevent duplicate processing using transaction ID
    const existingTx = await RewardTransaction.findOne({ 'metadata.tx_id': tx_id });
    if (existingTx) {
      return NextResponse.json({ status: 'OK', message: 'Already processed' }, { status: 200 });
    }

    // Update User Points
    user.rewardPoints += pointsToGive;
    user.lifetimeEarned += pointsToGive;
    await user.save();

    // Log Transaction
    await RewardTransaction.create({
      userId: user._id,
      amount: pointsToGive,
      type: 'EARN',
      provider: 'BitLabs',
      description: `Completed BitLabs Offer (${type || 'Survey'})`,
      metadata: { tx_id, rawPayload: payload }
    });

    return NextResponse.json({ status: 'OK' }, { status: 200 });

  } catch (error) {
    console.error('BitLabs Callback Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

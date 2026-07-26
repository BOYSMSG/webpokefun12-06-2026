import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '@/lib/mongoose';
import DeliveryQueue from '@/models/DeliveryQueue';
import User from '@/models/User';
import RewardTransaction from '@/models/RewardTransaction';

const SERVER_SECRET = process.env.PFCONNECT_SECRET || "default_pokefun_secret_123!"; // Make sure to define this in .env

// Verify Authorization Header
function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  return token === SERVER_SECRET;
}

// GET: Plugin polls for pending commands
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectMongo();
    
    // Find up to 50 pending deliveries
    const pendingDeliveries = await DeliveryQueue.find({ status: 'PENDING' })
      .sort({ createdAt: 1 })
      .limit(50);
      
    if (pendingDeliveries.length === 0) {
      return NextResponse.json({ deliveries: [] }, { status: 200 });
    }
    
    // Mark them as PROCESSING so another request doesn't pick them up
    const deliveryIds = pendingDeliveries.map(d => d._id);
    await DeliveryQueue.updateMany(
      { _id: { $in: deliveryIds } },
      { $set: { status: 'PROCESSING', lastAttempt: new Date() } }
    );
    
    return NextResponse.json({ deliveries: pendingDeliveries }, { status: 200 });
  } catch (error) {
    console.error('Plugin Deliveries GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Plugin reports success/failure of execution
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectMongo();
    const body = await req.json();
    const { results } = body; // Array of { id: string, status: 'DELIVERED' | 'FAILED', errorLog?: string }
    
    if (!results || !Array.isArray(results)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    // Process results sequentially to handle refunds
    for (const result of results) {
      if (!result.id) continue;
      
      const delivery = await DeliveryQueue.findById(result.id);
      if (!delivery) continue;

      // If it's failing now, and wasn't already failed/cancelled, refund the points
      if (result.status === 'FAILED' && !['FAILED', 'CANCELLED'].includes(delivery.status)) {
        if (delivery.pointsSpent && delivery.pointsSpent > 0) {
          const user = await User.findById(delivery.userId);
          if (user) {
            user.rewardPoints = (user.rewardPoints || 0) + delivery.pointsSpent;
            await user.save();
            
            // Log Refund
            await RewardTransaction.create({
              userId: user._id,
              amount: delivery.pointsSpent,
              type: 'REFUND',
              provider: 'System',
              description: `Refund for failed delivery: ${delivery.productName}`
            });
          }
        }
      }

      // Update Delivery Record
      delivery.status = result.status;
      if (result.errorLog) delivery.errorLog = result.errorLog;
      delivery.updatedAt = new Date();
      if (result.status === 'FAILED') {
        delivery.retryCount = (delivery.retryCount || 0) + 1;
      }
      
      await delivery.save();
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Plugin Deliveries POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

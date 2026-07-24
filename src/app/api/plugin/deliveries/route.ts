import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '@/lib/mongoose';
import DeliveryQueue from '@/models/DeliveryQueue';

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
    
    // Process results in bulk
    const bulkOps = results.map((result: any) => ({
      updateOne: {
        filter: { _id: result.id },
        update: { 
          $set: { 
            status: result.status, 
            errorLog: result.errorLog || '',
            updatedAt: new Date()
          },
          $inc: { retryCount: result.status === 'FAILED' ? 1 : 0 }
        }
      }
    }));
    
    if (bulkOps.length > 0) {
      await DeliveryQueue.bulkWrite(bulkOps);
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Plugin Deliveries POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

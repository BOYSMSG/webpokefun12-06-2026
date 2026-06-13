import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscription } = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.pushSubscriptions) {
      user.pushSubscriptions = [];
    }

    // Check if subscription already exists
    const existingSub = user.pushSubscriptions.find((sub: any) => sub.endpoint === subscription.endpoint);
    
    if (!existingSub) {
      user.pushSubscriptions.push(subscription);
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (error: any) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { endpoint } = await req.json();

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (user && user.pushSubscriptions) {
      user.pushSubscriptions = user.pushSubscriptions.filter((sub: any) => sub.endpoint !== endpoint);
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error: any) {
    console.error("Unsubscribe Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    const session = await import("next-auth").then(m => m.getServerSession(import("@/app/api/auth/[...nextauth]/route").then(m => m.authOptions)));
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const myEmail = session.user.email;

    const notifications = await Notification.find({
      $or: [
        { isGlobal: true },
        { userId: myEmail }
      ]
    }).sort({ createdAt: -1 }).limit(20).lean();

    const unreadCount = notifications.filter(n => !(n.readBy || []).includes(myEmail)).length;

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT() {
  try {
    const session = await import("next-auth").then(m => m.getServerSession(import("@/app/api/auth/[...nextauth]/route").then(m => m.authOptions)));
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const myEmail = session.user.email;

    // Mark all fetched notifications as read by adding myEmail to readBy array
    await Notification.updateMany(
      { 
        $or: [ { isGlobal: true }, { userId: myEmail } ],
        readBy: { $ne: myEmail }
      },
      { $push: { readBy: myEmail } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications mark read error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

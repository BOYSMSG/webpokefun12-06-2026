import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import { sendPushNotification } from "@/lib/webpush";
import dbConnect from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { targetUsername, roomID } = await req.json();

    const caller = await User.findOne({ email: session.user.email });
    const targetUser = await User.findOne({ username: targetUsername });

    if (!caller || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Send push notification to target user
    if (targetUser.pushSubscriptions && targetUser.pushSubscriptions.length > 0) {
      const payload = JSON.stringify({
        title: `Incoming Voice Call`,
        message: `${caller.username} is calling you! Click to answer.`,
        url: `/messages?user=${caller.username}&joinCall=${roomID}`,
        type: 'INCOMING_CALL'
      });

      const sendPromises = targetUser.pushSubscriptions.map((sub: any) =>
        sendPushNotification(sub, payload).catch(err => console.error('Push error:', err))
      );
      await Promise.all(sendPromises);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Call invite error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

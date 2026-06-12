import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetEmail } = await req.json();
    if (!targetEmail) {
      return NextResponse.json({ error: "Target email is required" }, { status: 400 });
    }

    const currentUserEmail = session.user?.email || "";

    if (currentUserEmail === targetEmail) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    await connectDB();
    const currentUser = await User.findOne({ email: currentUserEmail });
    const targetUser = await User.findOne({ email: targetEmail });

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isFollowing = currentUser.following.includes(targetEmail);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter((e: string) => e !== targetEmail);
      targetUser.followers = targetUser.followers.filter((e: string) => e !== currentUserEmail);
    } else {
      // Follow
      currentUser.following.push(targetEmail);
      targetUser.followers.push(currentUserEmail);
    }

    await currentUser.save();
    await targetUser.save();

    return NextResponse.json({ success: true, isFollowing: !isFollowing });
  } catch (error: any) {
    console.error("Follow error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

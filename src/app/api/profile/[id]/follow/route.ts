import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserEmail = session.user.email;
    const targetUserId = id; // Could be _id or email depending on how frontend sends it. Let's assume it's email.

    await connectDB();
    const currentUser = await User.findOne({ email: currentUserEmail });
    const targetUser = await User.findOne({ 
      $or: [{ username: targetUserId }, { email: targetUserId }] 
    });

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentUser.username === targetUser.username) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    const isFollowing = currentUser.following.includes(targetUser.username);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter((username: string) => username !== targetUser.username);
      targetUser.followers = targetUser.followers.filter((username: string) => username !== currentUser.username);
    } else {
      // Follow
      if (!currentUser.following.includes(targetUser.username)) currentUser.following.push(targetUser.username);
      if (!targetUser.followers.includes(currentUser.username)) targetUser.followers.push(currentUser.username);
    }

    await currentUser.save();
    await targetUser.save();

    return NextResponse.json({ 
      success: true, 
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length 
    });
  } catch (error: any) {
    console.error("Follow User Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

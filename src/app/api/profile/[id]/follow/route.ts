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

    if (currentUserEmail === targetUserId) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    await connectDB();
    
    const currentUser = await User.findOne({ email: currentUserEmail });
    const targetUser = await User.findOne({ email: targetUserId });

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter((id: string) => id !== targetUserId);
      targetUser.followers = targetUser.followers.filter((id: string) => id !== currentUserEmail);
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserEmail);
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

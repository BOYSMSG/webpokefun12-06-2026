import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Post from '@/models/Post';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'STAFF'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Aggregate users and count their posts
    const users = await User.find({}).select('name email image role isBanned').lean();
    
    // Get post counts grouped by authorId
    const postCounts = await Post.aggregate([
      { $group: { _id: "$authorId", count: { $sum: 1 } } }
    ]);
    
    const countMap: Record<string, number> = {};
    postCounts.forEach(pc => {
      countMap[pc._id] = pc.count;
    });

    const enrichedUsers = users.map(u => ({
      ...u,
      postCount: countMap[u.email] || 0
    }));

    return NextResponse.json({ users: enrichedUsers });
  } catch (error: any) {
    console.error("GET Admin Actions Users Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

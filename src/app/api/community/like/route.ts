import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import Post from "@/models/Post";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await connectDB();
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userId = session.user?.email || "";

    // Toggle Like logic
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id: string) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json({ success: true, likes: post.likes.length });
  } catch (error: any) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

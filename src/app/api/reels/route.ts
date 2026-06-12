import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Post from "@/models/Post";

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all posts where type is REEL, sorted by newest first
    const reels = await Post.find({ type: "REEL" }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reels });
  } catch (error: any) {
    console.error("Error fetching reels:", error);
    return NextResponse.json({ error: "Failed to fetch reels" }, { status: 500 });
  }
}

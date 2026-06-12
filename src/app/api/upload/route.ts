import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import Post from "@/models/Post";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string; // 'REEL' or 'POST'

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 2. Generate a unique filename
    const safeName = session.user?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'user';
    const uniqueFileName = `${safeName}_${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // 3. Write file to local disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    // 4. Create the public URL for the file
    const fileUrl = `/uploads/${uniqueFileName}`;

    // 5. Save to MongoDB Post collection
    await connectDB();
    const newPost = await Post.create({
      authorId: session.user?.email || "unknown",
      type: type || "REEL",
      title: title || "Untitled",
      content: fileUrl, // The local file URL
      likes: [],
      dislikes: [],
      views: 0,
      impressions: 0
    });

    return NextResponse.json({ 
      success: true, 
      link: fileUrl,
      downloadLink: fileUrl,
      postId: newPost._id
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload" }, { status: 500 });
  }
}

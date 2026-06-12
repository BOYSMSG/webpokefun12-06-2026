import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/models/Post';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'STAFF'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    await connectDB();
    
    // Delete all posts where authorId === email
    await Post.deleteMany({ authorId: email });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Clear Posts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

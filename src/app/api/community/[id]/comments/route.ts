import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Comment from '@/models/Comment';
import User from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await connectDB();
    const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 }).lean();

    // Fetch user details for each comment
    const userEmails = [...new Set(comments.map(c => c.authorId))];
    const users = await User.find({ email: { $in: userEmails } }).lean();
    
    const userMap: Record<string, any> = {};
    users.forEach(u => {
      userMap[u.email] = u;
    });

    const formattedComments = comments.map(comment => ({
      id: comment._id.toString(),
      author: userMap[comment.authorId]?.name || comment.authorId.split('@')[0],
      avatar: userMap[comment.authorId]?.image || `https://ui-avatars.com/api/?name=${comment.authorId.split('@')[0]}&background=random`,
      content: comment.content,
      timestamp: comment.createdAt,
    }));

    return NextResponse.json(formattedComments);
  } catch (error: any) {
    console.error("GET Comments Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    await connectDB();
    const newComment = await Comment.create({
      postId: id,
      authorId: session.user.email,
      content,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, commentId: newComment._id });
  } catch (error: any) {
    console.error("POST Comment Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/models/Post';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json(); // 'like' or 'dislike'
    const userEmail = session.user.email;

    await connectDB();
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (action === 'like') {
      // Remove from dislikes if exists
      post.dislikes = post.dislikes.filter((e: string) => e !== userEmail);
      // Toggle like
      if (post.likes.includes(userEmail)) {
        post.likes = post.likes.filter((e: string) => e !== userEmail);
      } else {
        post.likes.push(userEmail);
      }
    } else if (action === 'dislike') {
      // Remove from likes if exists
      post.likes = post.likes.filter((e: string) => e !== userEmail);
      // Toggle dislike
      if (post.dislikes.includes(userEmail)) {
        post.dislikes = post.dislikes.filter((e: string) => e !== userEmail);
      } else {
        post.dislikes.push(userEmail);
      }
    }

    await post.save();

    return NextResponse.json({ 
      success: true, 
      likes: post.likes.length, 
      dislikes: post.dislikes.length 
    });
  } catch (error: any) {
    console.error("Interact Post Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

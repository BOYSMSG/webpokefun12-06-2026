import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string, commentId: string }> }
) {
  try {
    const { id: postId, commentId } = await props.params;
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userEmail = session.user.email;
    const userRole = (session.user as any).role;
    const isPrivileged = userRole === 'OWNER' || userRole === 'ADMIN';

    const { action } = await req.json(); // 'like' or 'pin'

    await connectDB();
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (action === 'like') {
      const hasLiked = comment.likes?.includes(userEmail);
      if (hasLiked) {
        comment.likes = comment.likes.filter((email: string) => email !== userEmail);
      } else {
        if (!comment.likes) comment.likes = [];
        comment.likes.push(userEmail);
      }
      await comment.save();
      return NextResponse.json({ success: true, likes: comment.likes.length, isLiked: !hasLiked });
    }
    
    if (action === 'pin') {
      // Check if user is post author or admin
      const post = await Post.findById(postId);
      if (!post) {
         return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      
      const isPostAuthor = post.authorId === userEmail || post.authorId === (session.user as any).username;
      
      if (!isPrivileged && !isPostAuthor) {
         return NextResponse.json({ error: "Only the post author or admins can pin comments" }, { status: 403 });
      }

      // If pinning this comment, we usually want to unpin others. Or maybe allow multiple? Let's just unpin others for now.
      if (!comment.isPinned) {
        await Comment.updateMany({ postId }, { isPinned: false });
      }

      comment.isPinned = !comment.isPinned;
      await comment.save();
      return NextResponse.json({ success: true, isPinned: comment.isPinned });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Interact Comment Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

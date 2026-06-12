import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/models/Post';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await connectDB();
    const post = await Post.findById(id).lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch author info to attach avatar/name
    const author = await User.findOne({ email: post.authorId }).lean();

    const formattedPost = {
      ...post,
      id: post._id.toString(),
      author: author?.name || post.authorId.split('@')[0],
      avatar: author?.image || `https://ui-avatars.com/api/?name=${post.authorId.split('@')[0]}&background=random`,
      upvotes: (post.likes || []).length,
      downvotes: (post.dislikes || []).length,
      timestamp: post.createdAt,
    };

    return NextResponse.json(formattedPost);
  } catch (error: any) {
    console.error("GET Post Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = (session.user as any)?.role === 'ADMIN' || 
                    session.user.email === 'boysmsg832@gmail.com' || 
                    (session.user as any)?.discordId === 'boysmsg01';
                    
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const { reason } = await req.json();

    await connectDB();
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Send DM if reason provided
    if (reason && reason.trim() !== '') {
      const Message = (await import('@/models/Message')).default;
      const Notification = (await import('@/models/Notification')).default;
      
      await Message.create({
        senderId: 'pokefun_actions',
        receiverId: post.authorId,
        content: `Your post titled "${post.title}" was removed by an administrator. Reason: ${reason}`,
        read: false
      });

      await Notification.create({
        title: 'Post Removed',
        message: `Your post "${post.title}" was removed. Check your DMs for details.`,
        isGlobal: false,
        userId: post.authorId,
        createdAt: new Date()
      });
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Post Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

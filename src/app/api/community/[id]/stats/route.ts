import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/models/Post';
import User from '@/models/User';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await connectDB();
    
    const post = await Post.findById(id).lean();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const likesEmails = post.likes || [];
    const dislikesEmails = post.dislikes || [];
    const viewersEmails = post.viewers || [];

    // Collect all unique emails
    const allEmails = Array.from(new Set([...likesEmails, ...dislikesEmails, ...viewersEmails]));

    const users = await User.find({ email: { $in: allEmails } }).lean();
    
    // Map email to user details
    const userMap: Record<string, any> = {};
    users.forEach(u => {
      userMap[u.email] = {
        name: u.name,
        username: u.username,
        avatar: u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`
      };
    });

    // Resolve arrays
    const likes = likesEmails.map(email => userMap[email]).filter(Boolean);
    const dislikes = dislikesEmails.map(email => userMap[email]).filter(Boolean);
    const viewers = viewersEmails.map(email => userMap[email]).filter(Boolean);

    return NextResponse.json({ likes, dislikes, viewers });
  } catch (error: any) {
    console.error("GET Post Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { Metadata } from "next";
import connectDB from '@/lib/mongoose';
import Post from '@/models/Post';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const { id } = await props.params;
    await connectDB();
    const post = await Post.findById(id).lean();

    if (!post) {
      return { title: "Post Not Found | Pokefun Community" };
    }

    let imageUrl = "https://pokefun.in/images/logo.png";
    
    if (post.mediaType === 'image' && post.media) {
      imageUrl = post.media;
    } else if (post.mediaType === 'youtube' && post.media) {
       const videoIdMatch = post.media.match(/(?:v=|youtu\.be\/)([^&]+)/);
       if (videoIdMatch && videoIdMatch[1]) {
           imageUrl = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
       }
    }

    const shortContent = post.content 
      ? (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content) 
      : 'View this post on Pokefun Community';

    return {
      title: `${post.title} | Pokefun Community`,
      description: shortContent,
      openGraph: {
        title: `${post.title} | Pokefun Community`,
        description: shortContent,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: post.title,
          },
        ],
        siteName: "Pokefun SMP",
      },
      twitter: {
        card: "summary_large_image",
        title: `${post.title} | Pokefun Community`,
        description: shortContent,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Pokefun Community Post",
      description: "View this post on the Pokefun Community.",
    };
  }
}

export default function PostDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

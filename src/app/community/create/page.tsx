"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [postType, setPostType] = useState<string>('NOTE');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (status === 'unauthenticated') {
    return (
      <div style={{ textAlign: 'center', marginTop: '150px', color: 'white' }}>
        <h2>You must be logged in to post on the community.</h2>
        <a href="/login" style={{ color: '#10b981' }}>Go to Login</a>
      </div>
    );
  }

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsUploading(true);

    try {
      let finalMedia = media;
      let determinedMediaType = media ? 'image' : undefined;

      if (media) {
        if (media.includes('youtube.com/') || media.includes('youtu.be/')) {
          let videoId = '';
          if (media.includes('youtube.com/watch?v=')) {
            videoId = media.split('watch?v=')[1].split('&')[0];
          } else if (media.includes('youtu.be/')) {
            videoId = media.split('youtu.be/')[1].split('?')[0];
          } else if (media.includes('youtube.com/shorts/')) {
            videoId = media.split('youtube.com/shorts/')[1].split('?')[0];
          }
          if (videoId) {
             determinedMediaType = 'youtube';
             finalMedia = `https://www.youtube.com/embed/${videoId}`;
          } else if (media.includes('youtube.com/post/')) {
             determinedMediaType = 'youtube-post';
             finalMedia = media;
          } else {
             determinedMediaType = 'link';
          }
        } else if (media.includes('instagram.com/reel/') || media.includes('instagram.com/p/')) {
          determinedMediaType = 'instagram';
          if (media.includes('instagram.com/reel/')) {
            const instaId = media.split('instagram.com/reel/')[1].split('/')[0];
            finalMedia = `https://www.instagram.com/reel/${instaId}/embed`;
          } else {
            const instaId = media.split('instagram.com/p/')[1].split('/')[0];
            finalMedia = `https://www.instagram.com/p/${instaId}/embed`;
          }
        } else if (media.endsWith('.mp4') || media.endsWith('.webm')) {
          determinedMediaType = 'video';
        }
      }

      let submissionType = 'POST';
      if (postType === 'Announcements') submissionType = 'ANNOUNCEMENT';
      if (postType === 'Guides') submissionType = 'GUIDE';

      // Quick frontend admin check
      if (submissionType === 'ANNOUNCEMENT' || submissionType === 'GUIDE') {
        const isAdmin = (session?.user as any)?.role === 'ADMIN' || 
                        session?.user?.email === 'boysmsg832@gmail.com' || 
                        (session?.user as any)?.discordId === 'boysmsg01';
        if (!isAdmin) {
          alert("Only server admins can post Announcements or Guides!");
          setIsUploading(false);
          return;
        }
      }

      const res = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          type: submissionType,
          category: postType,
          media: finalMedia || undefined,
          mediaType: determinedMediaType
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Posted successfully!");
        router.push('/community');
      } else {
        alert("Failed to post. " + data.error);
        setIsUploading(false);
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong during posting.");
      setIsUploading(false);
    }
  };

  return (
    <div className="inner" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>Create Post</h1>
      <p style={{ color: 'gray', marginBottom: '30px' }}>Ask questions, share thoughts, or start a discussion with the community.</p>

      <form onSubmit={handlePost} style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>Category</label>
          <select 
            value={postType}
            onChange={(e) => setPostType(e.target.value as any)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }}
          >
            <option value="Announcements">Announcements (Admin)</option>
            <option value="Guides">Guides (Admin)</option>
            <option value="Showcase">Showcase</option>
            <option value="Builds">Builds</option>
            <option value="Safe Warp">Safe Warp</option>
            <option value="Home Locations">Home Locations</option>
            <option value="/phome">/phome</option>
            <option value="Homes">Homes</option>
            <option value="FAQs">FAQs</option>
            <option value="Memes">Memes</option>
            <option value="NOTE">Note / Thought</option>
            <option value="QUESTION">Question</option>
            <option value="DISCUSSION">Discussion</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>Title</label>
          <input 
            type="text" 
            required 
            placeholder={postType === 'QUESTION' ? "e.g. How to catch a Mewtwo?" : "e.g. My thoughts on the new update"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>Media URL (Image or YouTube Link)</label>
          <input 
            type="url" 
            placeholder="Paste a Discord image link or YouTube video link here..."
            value={media}
            onChange={(e) => setMedia(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>Content</label>
          <textarea 
            required 
            rows={5}
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', resize: 'vertical' }}
          ></textarea>
        </div>

        {isUploading ? (
          <p style={{ textAlign: 'center', color: 'gray', fontWeight: 'bold' }}>Publishing...</p>
        ) : (
          <button type="submit" style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: 'var(--accent-primary, #8b5cf6)', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(139,92,246, 0.4)' }}>
            <i className="fa-solid fa-paper-plane"></i> Publish Post
          </button>
        )}
        
      </form>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CreateGuidePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (status === 'loading') return <div style={{textAlign: 'center', marginTop: '100px', color: 'white'}}>Loading...</div>;

  const isAdmin = session?.user?.role === 'ADMIN' || 
                  session?.user?.email === 'boysmsg832@gmail.com' || 
                  (session?.user as any)?.discordId === 'boysmsg01';

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', marginTop: '150px', color: 'white' }}>
        <h2><i className="fa-solid fa-lock" style={{color: '#ef4444'}}></i> Access Denied</h2>
        <p style={{color: 'gray', marginTop: '10px'}}>Only server admins can publish guides.</p>
        <button onClick={() => router.back()} style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsUploading(true);

    try {
      let determinedMediaType = media ? 'image' : undefined;
      if (media) {
        if (media.includes('youtube.com/watch') || media.includes('youtu.be/')) {
          determinedMediaType = 'youtube';
        } else if (media.endsWith('.mp4') || media.endsWith('.webm')) {
          determinedMediaType = 'video';
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
          type: 'GUIDE',
          category: 'Guides',
          media: media || undefined,
          mediaType: determinedMediaType
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Guide published successfully!");
        router.push('/guide');
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
    <div className="inner" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '10px', color: '#10b981' }}><i className="fa-solid fa-book-open"></i> Write a Guide</h1>
      <p style={{ color: 'gray', marginBottom: '30px' }}>Create a tutorial or guide to help players understand the server.</p>

      <form onSubmit={handlePost} style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.2rem' }}>Title</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. How to get your first Cobblemon"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.2rem' }}>Cover Media (Image/YouTube Tutorial)</label>
          <input 
            type="url" 
            placeholder="Paste media link here..."
            value={media}
            onChange={(e) => setMedia(e.target.value)}
            style={{ width: '100%', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', fontSize: '1.1rem' }}
          />
        </div>

        <div style={{ marginBottom: '35px' }}>
          <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.2rem' }}>Guide Content</label>
          <textarea 
            required 
            rows={15}
            placeholder="Write the guide content here... Include steps, tips, and explanations."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', resize: 'vertical', fontSize: '1.1rem', lineHeight: '1.6', fontFamily: 'monospace' }}
          ></textarea>
        </div>

        {isUploading ? (
          <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}><i className="fa-solid fa-spinner fa-spin"></i> Publishing...</div>
        ) : (
          <button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '10px', border: 'none', background: '#059669', color: 'white', fontWeight: 'bold', fontSize: '1.3rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(5,150,105, 0.4)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
            <i className="fa-solid fa-upload"></i> Publish Guide
          </button>
        )}
        
      </form>
    </div>
  );
}

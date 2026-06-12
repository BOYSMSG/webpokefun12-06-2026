"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AnnouncementsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = (session?.user as any)?.role === 'ADMIN' || 
                  session?.user?.email === 'boysmsg832@gmail.com' || 
                  (session?.user as any)?.discordId === 'boysmsg01';

  useEffect(() => {
    fetch('/api/community?type=ANNOUNCEMENT')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleInteract = async (e: React.MouseEvent, postId: string, action: 'like' | 'dislike') => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/community/${postId}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev: any) => prev.map((p: any) => {
          if (p.id === postId) {
            return { ...p, upvotes: data.likes, downvotes: data.dislikes };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '10px', color: '#f59e0b' }}>Server Announcements</h1>
          <p style={{ fontSize: '1.2rem', color: 'gray' }}>Stay up to date with the latest news, events, and patch notes from the Staff Team.</p>
        </div>
        {isAdmin && (
          <Link href="/announcements/create">
            <button style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(239,68,68,0.3)',
              transition: 'transform 0.2s'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
              + Post Announcement
            </button>
          </Link>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'gray' }}>Loading announcements...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'gray', background: 'rgba(0,0,0,0.2)', borderRadius: '20px' }}>
              No announcements yet.
            </div>
          ) : (
            posts.map((post: any) => (
              <div key={post.id} onClick={() => router.push(`/community/post/${post.id}`)} style={{ 
                background: 'rgba(245, 158, 11, 0.05)', 
                color: 'white',
                border: '1px solid rgba(245, 158, 11, 0.3)', 
                borderRadius: '16px', 
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(245,158,11,0.2)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {post.media && post.mediaType === 'image' && (
                  <img src={post.media} alt="Announcement media" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                )}
                {post.media && post.mediaType === 'video' && (
                  <video src={post.media} controls style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                )}
                {post.media && post.mediaType === 'youtube' && (
                  <iframe 
                    width="100%" 
                    height="400" 
                    src={post.media.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                )}
                
                <div style={{ padding: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.9rem', background: '#f59e0b', color: 'black', padding: '4px 12px', borderRadius: '12px', fontWeight: 800 }}><i className="fa-solid fa-bullhorn"></i> ANNOUNCEMENT</span>
                    <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>{new Date(post.timestamp).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '15px', color: '#f59e0b' }}>{post.title}</h3>
                  <p style={{ color: '#d1d5db', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                    <div onClick={(e) => { e.stopPropagation(); router.push(`/profile/${post.authorId}`); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.opacity = '0.8'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                      <img src={post.avatar} alt={post.author} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #ef4444' }} />
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444' }}>{post.author} (Admin)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#9ca3af', fontSize: '1.1rem' }}>
                      <button onClick={(e) => handleInteract(e, post.id, 'like')} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onMouseOver={e => e.currentTarget.style.color = '#10b981'}>
                        <i className="fa-solid fa-heart"></i> {post.upvotes}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); router.push(`/community/post/${post.id}`); }} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onMouseOver={e => e.currentTarget.style.color = '#3b82f6'}>
                        <i className="fa-solid fa-comment"></i> Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

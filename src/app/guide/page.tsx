"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function GuidePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = (session?.user as any)?.role === 'ADMIN' || 
                  session?.user?.email === 'boysmsg832@gmail.com' || 
                  (session?.user as any)?.discordId === 'boysmsg01';

  useEffect(() => {
    fetch('/api/community?type=GUIDE')
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
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '10px', color: '#10b981' }}>Official Guides</h1>
          <p style={{ fontSize: '1.2rem', color: 'gray' }}>Learn everything about the server mechanics, commands, and secrets.</p>
        </div>
        {isAdmin && (
          <Link href="/guide/create">
            <button style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
              transition: 'transform 0.2s'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
              + Write Guide
            </button>
          </Link>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'gray' }}>Loading guides...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}>
          {posts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'gray', background: 'rgba(0,0,0,0.2)', borderRadius: '20px' }}>
              No guides have been published yet.
            </div>
          ) : (
            posts.map((post: any) => (
              <div key={post.id} onClick={() => router.push(`/community/post/${post.id}`)} style={{ 
                background: '#111827', 
                color: 'white',
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                borderRadius: '16px', 
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.border = '1px solid rgba(16, 185, 129, 0.5)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(16,185,129,0.1)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.border = '1px solid rgba(16, 185, 129, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {post.media && post.mediaType === 'image' && (
                  <img src={post.media} alt="Guide media" style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
                )}
                {post.media && post.mediaType === 'video' && (
                  <video src={post.media} controls style={{ width: '100%', height: '350px', objectFit: 'cover', background: 'black' }} />
                )}
                {post.media && post.mediaType === 'youtube' && (
                  <iframe 
                    width="100%" 
                    height="350" 
                    src={post.media.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                )}
                
                <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}><i className="fa-solid fa-book"></i> GUIDE</span>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{new Date(post.timestamp).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px', color: '#fff' }}>{post.title}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: '1.6', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.content}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                    <div onClick={(e) => { e.stopPropagation(); router.push(`/profile/${post.authorId}`); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <img src={post.avatar} alt={post.author} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6b7280' }}>{post.author}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#6b7280', fontSize: '1rem' }}>
                      <button onClick={(e) => handleInteract(e, post.id, 'like')} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }} onMouseOver={e => e.currentTarget.style.color = '#10b981'}>
                        <i className="fa-solid fa-thumbs-up"></i> {post.upvotes}
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

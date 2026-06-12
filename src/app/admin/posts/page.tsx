"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated' || !['ADMIN', 'STAFF'].includes((session?.user as any)?.role)) {
      router.push('/admin');
      return;
    }

    fetch('/api/admin/posts')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session, status, router]);

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const res = await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    
    if (res.ok) {
      setPosts(posts.filter(p => p._id !== id));
      alert("Post deleted successfully");
    } else {
      alert("Failed to delete post");
    }
  };

  if (loading || status === 'loading') return <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>Loading Posts...</div>;

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <button onClick={() => router.push('/admin')} style={{ background: 'transparent', border: '1px solid #444', color: 'white', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', margin: 0 }}>Moderate Posts</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {posts.length === 0 ? (
          <p style={{ color: 'gray' }}>No posts found.</p>
        ) : (
          posts.map(post => (
            <div key={post._id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              {post.type === 'REEL' ? (
                <video src={post.content} controls style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              ) : (
                <img src={post.content} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              )}
              <div style={{ padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h4 style={{ color: 'white', margin: 0, fontSize: '1.2rem', flex: 1 }}>{post.title}</h4>
                  <span style={{ fontSize: '0.8rem', background: post.type === 'REEL' ? '#ef4444' : '#3b82f6', color: 'white', padding: '4px 8px', borderRadius: '5px', fontWeight: 'bold' }}>{post.type}</span>
                </div>
                
                <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '5px' }}>By: {post.authorId}</p>
                <p style={{ color: 'gray', fontSize: '0.8rem', marginBottom: '15px' }}>{new Date(post.createdAt).toLocaleString()}</p>
                
                <button 
                  onClick={() => handleDeletePost(post._id)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#ef4444'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#ef4444'}
                >
                  <i className="fa-solid fa-trash"></i> Delete Post
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

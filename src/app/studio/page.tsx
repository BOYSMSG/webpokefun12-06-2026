"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CreatorStudioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalViews: 0, totalImpressions: 0, totalLikes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.email) {
      fetch('/api/studio')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setPosts(data.posts || []);
            setStats(data.stats || { totalViews: 0, totalImpressions: 0, totalLikes: 0 });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session, status, router]);

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post/reel permanently?")) return;

    const res = await fetch('/api/studio', {
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

  if (loading || status === 'loading') return <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>Loading Studio...</div>;

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#f59e0b', margin: 0 }}>Creator Studio</h1>
          <p style={{ color: 'gray', marginTop: '5px' }}>Analyze your performance and manage your content.</p>
        </div>
        <button onClick={() => router.push('/community/create')} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)' }}>
          <i className="fa-solid fa-plus"></i> Upload New
        </button>
      </div>

      {/* Analytics Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.2))', padding: '30px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)', textAlign: 'center' }}>
          <i className="fa-solid fa-eye" style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '15px' }}></i>
          <h3 style={{ fontSize: '2rem', color: 'white', margin: '0 0 5px 0' }}>{stats.totalViews}</h3>
          <p style={{ color: '#93c5fd', margin: 0, fontWeight: 'bold' }}>Total Views</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.2))', padding: '30px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
          <i className="fa-solid fa-chart-line" style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '15px' }}></i>
          <h3 style={{ fontSize: '2rem', color: 'white', margin: '0 0 5px 0' }}>{stats.totalImpressions}</h3>
          <p style={{ color: '#6ee7b7', margin: 0, fontWeight: 'bold' }}>Total Impressions</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.2))', padding: '30px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
          <i className="fa-solid fa-heart" style={{ fontSize: '2.5rem', color: '#ef4444', marginBottom: '15px' }}></i>
          <h3 style={{ fontSize: '2rem', color: 'white', margin: '0 0 5px 0' }}>{stats.totalLikes}</h3>
          <p style={{ color: '#fca5a5', margin: 0, fontWeight: 'bold' }}>Total Likes</p>
        </div>
      </div>

      {/* Content Management Table */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead style={{ background: 'rgba(0,0,0,0.5)' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #444' }}>Content</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #444' }}>Type</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #444' }}>Date</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #444' }}>Views</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #444' }}>Likes</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #444' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'gray' }}>You haven't uploaded any content yet.</td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '60px', height: '40px', background: '#222', borderRadius: '5px', overflow: 'hidden' }}>
                      {post.type === 'REEL' ? (
                        <video src={post.content} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <img src={post.content} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                    <span style={{ fontWeight: 'bold' }}>{post.title}</span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ background: post.type === 'REEL' ? '#ef4444' : '#3b82f6', color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' }}>{post.type}</span>
                  </td>
                  <td style={{ padding: '15px', color: 'gray' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '15px', textAlign: 'center', color: '#3b82f6', fontWeight: 'bold' }}>{post.views || 0}</td>
                  <td style={{ padding: '15px', textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>{post.likes?.length || 0}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDeletePost(post._id)}
                      style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', transition: '0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

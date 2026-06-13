"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Stats Modal State
  const [activeStatsReel, setActiveStatsReel] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<{ likes: any[], dislikes: any[], viewers: any[] }>({ likes: [], dislikes: [], viewers: [] });
  const [activeStatsTab, setActiveStatsTab] = useState<'views' | 'likes' | 'dislikes'>('views');
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchStats = async (id: string) => {
    setActiveStatsReel(id);
    setActiveStatsTab('views');
    setIsStatsLoading(true);
    try {
      const res = await fetch(`/api/community/${id}/stats`);
      if (res.ok) {
        setStatsData(await res.json());
      } else {
        setStatsData({ likes: [], dislikes: [], viewers: [] });
      }
    } catch (e) {
      setStatsData({ likes: [], dislikes: [], viewers: [] });
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/community')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("API returned error:", data);
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
        // Update local state to reflect new likes/dislikes
        setPosts((prev: any) => prev.map((p: any) => {
          if (p.id === postId) {
            return { 
              ...p, 
              upvotes: data.likes, 
              downvotes: data.dislikes,
              isLiked: data.isLiked,
              isDisliked: data.isDisliked
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavorite = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/community/${postId}/favorite`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev: any) => prev.map((p: any) => {
          if (p.id === postId) {
            return { ...p, isSaved: data.isFavorited };
          }
          return p;
        }));
      } else if (res.status === 401) {
        alert("Please login to save posts.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (e: React.MouseEvent, authorUsername: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/profile/${authorUsername}/follow`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPosts((prev: any) => prev.map((p: any) => {
            if (p.authorUsername === authorUsername) {
              return { ...p, isFollowing: data.isFollowing };
            }
            return p;
          }));
        } else {
          alert(data.error || "Please login to follow.");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ["All", "Favorites", "Announcements", "Guides", "Showcase", "Builds", "Safe Warp", "Home Locations", "/phome", "Homes", "FAQs", "Memes"];

  let filteredPosts = filter === "All" 
    ? [...posts] 
    : filter === "Favorites"
    ? posts.filter((p: any) => p.isSaved)
    : posts.filter((p: any) => p.category === filter);

  if (sortBy === "Newest") {
    filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } else if (sortBy === "Oldest") {
    filteredPosts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } else if (sortBy === "Most Liked") {
    filteredPosts.sort((a, b) => b.upvotes - a.upvotes);
  } else if (sortBy === "Trending") {
    filteredPosts.sort((a, b) => (b.views || 0) + b.upvotes * 5 - ((a.views || 0) + a.upvotes * 5));
  }

  return (
    <div className="inner" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '5px', color: 'var(--text-color, #fff)' }}>Community Hub</h1>
          <p style={{ fontSize: '1.2rem', color: 'gray' }}>Share your builds, rare catches, and stories with the Pokefun server!</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '10px 15px',
              borderRadius: '20px',
              fontSize: '1rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Newest" style={{ background: '#1f2937' }}>Newest</option>
            <option value="Oldest" style={{ background: '#1f2937' }}>Oldest</option>
            <option value="Most Liked" style={{ background: '#1f2937' }}>Most Liked</option>
            <option value="Trending" style={{ background: '#1f2937' }}>Trending (Reach)</option>
          </select>
          <Link href="/community/create">
            <button style={{
              background: 'var(--accent-primary, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
              transition: 'transform 0.2s'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
              + Create Post
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        .category-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .category-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .category-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .category-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <div className="category-scroll" style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', maxWidth: '100%' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                flexShrink: 0,
                padding: '8px 20px',
                borderRadius: '20px',
                border: filter === cat ? 'none' : '1px solid rgba(255,255,255,0.2)',
                background: filter === cat ? 'var(--accent-primary, #8b5cf6)' : 'transparent',
                color: filter === cat ? 'white' : '#d1d5db',
                cursor: 'pointer',
                fontWeight: 600,
                transition: '0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'gray' }}>Loading posts...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
          {filteredPosts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'gray', background: 'rgba(0,0,0,0.2)', borderRadius: '20px' }}>
              No posts found in this category. Be the first to post!
            </div>
          ) : (
            filteredPosts.map((post: any) => (
              <div key={post.id} onClick={() => router.push(`/community/post/${post.id}`)} style={{ 
                background: '#1f2937', 
                color: 'white',
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '16px', 
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Media if exists */}
                {post.media && (
                  <div style={{ width: '100%', maxHeight: '300px', overflow: 'hidden', background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {post.mediaType === 'image' ? (
                      <img src={post.media} alt={post.title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                    ) : post.mediaType === 'youtube' ? (
                      <iframe width="100%" height="250" src={post.media.replace("watch?v=", "embed/").replace("autoplay=1", "autoplay=0")} title="YouTube video" frameBorder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen onClick={e => e.stopPropagation()}></iframe>
                    ) : post.mediaType === 'instagram' ? (
                      <iframe width="100%" height="300" src={post.media} frameBorder="0" scrolling="no" allowTransparency onClick={e => e.stopPropagation()}></iframe>
                    ) : post.mediaType === 'youtube-post' ? (
                      <div style={{ width: '100%', height: '250px', background: 'linear-gradient(135deg, #cc0000, #ff4444)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '20px', textAlign: 'center' }} onClick={(e) => { e.stopPropagation(); window.open(post.media, '_blank'); }}>
                        <i className="fa-brands fa-youtube" style={{ fontSize: '4rem', marginBottom: '15px' }}></i>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>YouTube Community Post</h4>
                        <p style={{ margin: '10px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Click to view post on YouTube</p>
                      </div>
                    ) : post.mediaType === 'video' ? (
                      <video src={post.media} controls style={{ width: '100%', height: '250px' }} onClick={e => e.stopPropagation()}></video>
                    ) : null}
                  </div>
                )}
                
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(139,92,246,0.2)', color: '#c084fc', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>{post.category}</span>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{new Date(post.timestamp).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px', color: '#f3f4f6' }}>{post.title}</h3>
                  <p style={{ color: '#d1d5db', fontSize: '1rem', lineHeight: '1.5', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.content}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', flexWrap: 'wrap', gap: '15px' }}>
                    <div onClick={(e) => { e.stopPropagation(); router.push(`/profile/${post.authorUsername}`); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.opacity = '0.8'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                      <img src={post.avatar} alt={post.author} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f3f4f6' }}>{post.author}</span>
                          <button onClick={(e) => handleFollow(e, post.authorUsername)} style={{ background: post.isFollowing ? 'transparent' : '#8b5cf6', color: post.isFollowing ? '#9ca3af' : 'white', border: post.isFollowing ? '1px solid rgba(255,255,255,0.1)' : 'none', padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => { if(!post.isFollowing) e.currentTarget.style.transform = 'scale(1.05)' }} onMouseOut={e => { if(!post.isFollowing) e.currentTarget.style.transform = 'scale(1)' }}>
                            {post.isFollowing ? 'Following' : 'Follow'}
                          </button>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>@{post.authorUsername}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#9ca3af', fontSize: '1.6rem', flexWrap: 'wrap' }}>
                      <button onClick={(e) => handleInteract(e, post.id, 'like')} style={{ background: 'transparent', border: 'none', color: post.isLiked ? '#ef4444' : '#9ca3af', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onMouseOver={e => !post.isLiked && (e.currentTarget.style.color = '#ef4444')} onMouseOut={e => !post.isLiked && (e.currentTarget.style.color = '#9ca3af')}>
                        <i className="fa-solid fa-thumbs-up"></i> {post.upvotes}
                      </button>
                      <button onClick={(e) => handleInteract(e, post.id, 'dislike')} style={{ background: 'transparent', border: 'none', color: post.isDisliked ? '#3b82f6' : '#9ca3af', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }} onMouseOver={e => !post.isDisliked && (e.currentTarget.style.color = '#3b82f6')} onMouseOut={e => !post.isDisliked && (e.currentTarget.style.color = '#9ca3af')}>
                        <i className="fa-solid fa-thumbs-down"></i> {post.downvotes}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); router.push(`/community/post/${post.id}`); }} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }} onMouseOver={e => e.currentTarget.style.color = '#10b981'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>
                        <i className="fa-solid fa-comment"></i>
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#9ca3af' }} title="Reach / Views">
                        <i className="fa-solid fa-eye"></i> {post.views || 0}
                      </div>
                      <button onClick={(e) => handleFavorite(e, post.id)} style={{ background: 'transparent', border: 'none', color: post.isSaved ? '#fbbf24' : '#9ca3af', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }} onMouseOver={e => !post.isSaved && (e.currentTarget.style.color = '#fbbf24')} onMouseOut={e => !post.isSaved && (e.currentTarget.style.color = '#9ca3af')} title={post.isSaved ? "Remove from Favorites" : "Save to Favorites"}>
                        <i className={post.isSaved ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); fetchStats(post.id); }} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }} onMouseOver={e => e.currentTarget.style.color = '#38bdf8'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'} title="Spy Insights">
                        <i className="fa-solid fa-chart-simple"></i>
                      </button>
                      <button style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }} onMouseOver={e => e.currentTarget.style.color = '#8b5cf6'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'} onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.origin + '/community/post/' + post.id); alert('Link copied!'); }}>
                        <i className="fa-solid fa-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Slide-up Stats Modal */}
      {mounted && activeStatsReel && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 100002, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={() => setActiveStatsReel(null)}>
          <div style={{ background: '#111827', width: '100%', height: '60%', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: 'white' }}>Post Insights</h3>
              <button onClick={() => setActiveStatsReel(null)} style={{ background: 'transparent', border: 'none', color: 'gray', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-times"></i></button>
            </div>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #374151', marginBottom: '15px' }}>
              <button onClick={() => setActiveStatsTab('views')} style={{ background: 'transparent', border: 'none', color: activeStatsTab === 'views' ? 'white' : 'gray', paddingBottom: '10px', borderBottom: activeStatsTab === 'views' ? '2px solid white' : 'none', fontWeight: 'bold', cursor: 'pointer' }}>Views ({statsData?.viewers?.length || 0})</button>
              <button onClick={() => setActiveStatsTab('likes')} style={{ background: 'transparent', border: 'none', color: activeStatsTab === 'likes' ? 'white' : 'gray', paddingBottom: '10px', borderBottom: activeStatsTab === 'likes' ? '2px solid white' : 'none', fontWeight: 'bold', cursor: 'pointer' }}>Likes ({statsData?.likes?.length || 0})</button>
              <button onClick={() => setActiveStatsTab('dislikes')} style={{ background: 'transparent', border: 'none', color: activeStatsTab === 'dislikes' ? 'white' : 'gray', paddingBottom: '10px', borderBottom: activeStatsTab === 'dislikes' ? '2px solid white' : 'none', fontWeight: 'bold', cursor: 'pointer' }}>Dislikes ({statsData?.dislikes?.length || 0})</button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {isStatsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '10px' }}>
                  <i className="fa-solid fa-circle-notch fa-spin" style={{ color: '#8b5cf6', fontSize: '2rem' }}></i>
                  <span style={{ color: 'gray', fontSize: '0.9rem' }}>Loading insights...</span>
                </div>
              ) : !(statsData?.[activeStatsTab === 'views' ? 'viewers' : activeStatsTab]?.length > 0) ? (
                <p style={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>No users found.</p>
              ) : (
                statsData[activeStatsTab === 'views' ? 'viewers' : activeStatsTab].map((u: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.location.href = `/profile/${u.username}`}>
                    <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=random`} alt={u.name || 'User'} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>{u.username || 'Unknown'}</span>
                      <span style={{ color: 'gray', fontSize: '0.8rem' }}>{u.name || ''}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ReelsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReelTitle, setNewReelTitle] = useState("");
  const [newReelDescription, setNewReelDescription] = useState("");
  const [newReelUrl, setNewReelUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Comments Modal State
  const [activeCommentsReel, setActiveCommentsReel] = useState<string | null>(null);
  const [activeComments, setActiveComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  // Stats Modal State
  const [activeStatsReel, setActiveStatsReel] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<{ likes: any[], dislikes: any[], viewers: any[] }>({ likes: [], dislikes: [], viewers: [] });
  const [activeStatsTab, setActiveStatsTab] = useState<'views' | 'likes' | 'dislikes'>('views');

  // Active Reel Tracker
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchReels();
    // Pause global website music when entering Reels page
    window.dispatchEvent(new Event('pauseGlobalMusic'));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        // Calculate which reel is currently in the viewport
        const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
        if (index !== activeIndex) {
          setActiveIndex(index);
        }
      }
    };
    const el = containerRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => { if (el) el.removeEventListener('scroll', handleScroll); };
  }, [activeIndex, reels]);

  const fetchReels = async () => {
    try {
      const res = await fetch('/api/community?type=REEL');
      if (res.ok) {
        setReels(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return alert("Please login to post a reel!");
    if (!newReelTitle.trim() || !newReelUrl.trim()) return alert("Title and URL are required!");

    let finalMedia = newReelUrl;
    let finalMediaType = 'video';

    // Parse URL
    if (newReelUrl.includes('youtube.com/shorts/') || newReelUrl.includes('youtu.be/')) {
      finalMediaType = 'youtube';
      let videoId = '';
      if (newReelUrl.includes('youtube.com/shorts/')) {
        videoId = newReelUrl.split('youtube.com/shorts/')[1].split('?')[0];
      } else if (newReelUrl.includes('youtu.be/')) {
        videoId = newReelUrl.split('youtu.be/')[1].split('?')[0];
      }
      finalMedia = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=0&controls=0&modestbranding=1&rel=0`;
    } else if (newReelUrl.includes('instagram.com/reel/')) {
      finalMediaType = 'instagram';
      const instaId = newReelUrl.split('instagram.com/reel/')[1].split('/')[0];
      finalMedia = `https://www.instagram.com/reel/${instaId}/embed`;
    }

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newReelTitle,
          content: newReelDescription || "Reel",
          type: "REEL",
          category: "Reels",
          media: finalMedia,
          mediaType: finalMediaType
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewReelTitle("");
        setNewReelDescription("");
        setNewReelUrl("");
        fetchReels();
      } else {
        alert("Failed to add reel");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInteract = async (postId: string, action: 'like' | 'dislike' | 'favorite') => {
    if (!session) return alert("Please login to interact!");
    try {
      if (action === 'favorite') {
        const res = await fetch(`/api/community/${postId}/favorite`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setReels(prev => prev.map(p => p.id === postId ? { ...p, isSaved: data.isFavorited } : p));
        }
      } else {
        const res = await fetch(`/api/community/${postId}/interact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        });
        if (res.ok) {
          const data = await res.json();
          setReels(prev => prev.map(p => p.id === postId ? {
            ...p,
            upvotes: data.likes,
            downvotes: data.dislikes,
            isLiked: data.isLiked,
            isDisliked: data.isDisliked
          } : p));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchComments = async (id: string) => {
    try {
      const res = await fetch(`/api/community/${id}/comments`);
      if (res.ok) setActiveComments(await res.json());
    } catch (e) {}
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return alert("Please login to comment!");
    if (!newComment.trim() || !activeCommentsReel) return;

    try {
      const res = await fetch(`/api/community/${activeCommentsReel}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });
      if (res.ok) {
        setNewComment("");
        fetchComments(activeCommentsReel);
      }
    } catch (e) {}
  };

  const fetchStats = async (id: string) => {
    setActiveStatsReel(id);
    setActiveStatsTab('views');
    try {
      const res = await fetch(`/api/community/${id}/stats`);
      if (res.ok) setStatsData(await res.json());
    } catch (e) {}
  };

  return (
    <div style={{ background: 'black', width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 10000, overflow: 'hidden' }}>
      {/* Global CSS to hide website layout elements */}
      <style>{`
        #gh-header, #nav, #footer, .desktop-sidebar-container, .global-sidebar-toggle, .global-sidebar, #ai-chat-widget {
          display: none !important;
        }
        .snap-container {
          height: 100dvh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        .snap-container::-webkit-scrollbar {
          display: none;
        }
        .reel-item {
          height: 100dvh;
          width: 100vw;
          scroll-snap-align: start;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          background: black;
        }
        .reel-media {
          height: 100%;
          max-width: 500px;
          width: 100%;
          object-fit: cover;
          background: #111;
        }
        .reel-overlay {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          max-width: 500px;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 25%);
        }
        .reel-info {
          position: absolute;
          bottom: 20px;
          left: 15px;
          right: 70px;
          color: white;
          pointer-events: auto;
        }
        .reel-actions {
          position: absolute;
          bottom: 20px;
          right: 15px;
          display: flex;
          flex-direction: column;
          gap: 25px;
          align-items: center;
          pointer-events: auto;
        }
        .action-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          transition: transform 0.2s;
        }
        .action-btn:hover {
          transform: scale(1.1);
        }
        .action-text {
          font-size: 0.85rem;
          font-weight: 600;
        }
      `}</style>

      {/* Top Nav */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '500px', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10001, background: 'linear-gradient(rgba(0,0,0,0.5), transparent)' }}>
        <Link href="/community" style={{ color: 'white', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          <i className="fa-solid fa-arrow-left"></i> Reels
        </Link>
        <button onClick={() => setShowAddModal(true)} style={{ background: 'transparent', color: 'white', border: 'none', fontSize: '1.6rem', cursor: 'pointer', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          <i className="fa-solid fa-camera"></i>
        </button>
      </div>

      {loading ? (
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'gray', fontSize: '1.5rem' }}>Loading Reels...</div>
      ) : reels.length === 0 ? (
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'gray', flexDirection: 'column' }}>
          <i className="fa-solid fa-film" style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}></i>
          <h2>No Reels yet!</h2>
          <p>Be the first to add a Pokemon short or clip.</p>
        </div>
      ) : (
        <div className="snap-container" ref={containerRef}>
          {reels.map((reel, index) => (
            <div key={reel.id} className="reel-item">
              
              {/* Media Renderer */}
              {reel.mediaType === 'youtube' ? (
                activeIndex === index ? <iframe src={reel.media} className="reel-media" style={{ border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> : <div className="reel-media" style={{background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><i className="fa-solid fa-spinner fa-spin" style={{ color: 'white', fontSize: '2rem' }}></i></div>
              ) : reel.mediaType === 'instagram' ? (
                activeIndex === index ? <iframe src={reel.media} className="reel-media" style={{ border: 'none' }} scrolling="no" allowTransparency></iframe> : <div className="reel-media" style={{background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><i className="fa-solid fa-spinner fa-spin" style={{ color: 'white', fontSize: '2rem' }}></i></div>
              ) : (
                <video src={reel.media} className="reel-media" autoPlay={activeIndex === index} loop muted playsInline controls={false} ref={el => {
                  if (el) {
                    if (activeIndex === index) el.play().catch(()=>{});
                    else el.pause();
                  }
                }} />
              )}

              {/* Overlay Content */}
              <div className="reel-overlay">
                <div className="reel-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }} onClick={() => router.push(`/profile/${reel.authorUsername}`)}>
                    <img src={reel.avatar} alt={reel.author} style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid white', cursor: 'pointer' }} />
                    <span style={{ fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', textShadow: '0 1px 3px black' }}>{reel.authorUsername}</span>
                    <button style={{ background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '5px' }}>Follow</button>
                  </div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 'normal', textShadow: '0 1px 3px black', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{reel.title}</h3>
                </div>
                
                {/* Actions Sidebar */}
                <div className="reel-actions">
                  <button className="action-btn" onClick={() => handleInteract(reel.id, 'like')} style={{ color: reel.isLiked ? '#ef4444' : 'white' }}>
                    <i className="fa-solid fa-heart"></i>
                    <span className="action-text">{reel.upvotes}</span>
                  </button>
                  <button className="action-btn" onClick={() => { setActiveCommentsReel(reel.id); fetchComments(reel.id); }}>
                    <i className="fa-solid fa-comment"></i>
                    <span className="action-text">1</span>
                  </button>
                  <button className="action-btn" onClick={() => handleInteract(reel.id, 'favorite')} style={{ color: reel.isSaved ? '#fbbf24' : 'white' }}>
                    <i className={reel.isSaved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                  </button>
                  <button className="action-btn" onClick={() => { navigator.clipboard.writeText(window.location.origin + '/community/post/' + reel.id); alert('Link copied!'); }}>
                    <i className="fa-solid fa-share"></i>
                  </button>
                  <button className="action-btn" onClick={() => fetchStats(reel.id)}>
                    <i className="fa-solid fa-chart-simple" style={{ fontSize: '1.5rem' }}></i>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 100000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#1f2937', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '500px', border: '1px solid #374151' }}>
            <h2 style={{ color: 'white', marginTop: 0, marginBottom: '20px' }}>Add a Reel</h2>
            <form onSubmit={handleAddReel}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: 'gray', display: 'block', marginBottom: '5px' }}>Reel Title</label>
                <input type="text" value={newReelTitle} onChange={e => setNewReelTitle(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4b5563', background: '#374151', color: 'white', outline: 'none' }} placeholder="e.g. My epic shiny catch!" />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: 'gray', display: 'block', marginBottom: '5px' }}>Description (Optional)</label>
                <textarea value={newReelDescription} onChange={e => setNewReelDescription(e.target.value)} rows={2} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4b5563', background: '#374151', color: 'white', outline: 'none' }} placeholder="Tell us more about this reel..." />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ color: 'gray', display: 'block', marginBottom: '5px' }}>Video URL (YouTube Shorts, Discord .mp4)</label>
                <input type="url" value={newReelUrl} onChange={e => setNewReelUrl(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4b5563', background: '#374151', color: 'white', outline: 'none' }} placeholder="https://youtube.com/shorts/..." />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #4b5563', color: 'white', borderRadius: '20px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#8b5cf6', border: 'none', color: 'white', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Post Reel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-up Comments Modal */}
      {activeCommentsReel && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 100002, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={() => setActiveCommentsReel(null)}>
          <div style={{ background: '#111827', width: '100%', height: '60%', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            `}</style>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: 'white' }}>Comments ({activeComments.length})</h3>
              <button onClick={() => setActiveCommentsReel(null)} style={{ background: 'transparent', border: 'none', color: 'gray', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-times"></i></button>
            </div>
            
            {/* Comments List */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {activeComments.length === 0 ? (
                <p style={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>No comments yet. Be the first to comment!</p>
              ) : (
                activeComments.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '10px' }}>
                    <img src={c.avatar} alt={c.author} style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
                    <div>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', marginRight: '8px' }}>{c.author}</span>
                      <span style={{ color: 'gray', fontSize: '0.75rem' }}>{new Date(c.timestamp).toLocaleDateString()}</span>
                      <p style={{ color: '#d1d5db', fontSize: '0.9rem', margin: '2px 0 0 0', lineHeight: '1.4' }}>{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Input Form */}
            <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px' }}>
              <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." style={{ flex: 1, padding: '12px 15px', borderRadius: '20px', border: '1px solid #374151', background: '#1f2937', color: 'white', outline: 'none' }} />
              <button type="submit" style={{ background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '20px', padding: '0 20px', fontWeight: 'bold', cursor: 'pointer' }}>Post</button>
            </form>
          </div>
        </div>
      )}

      {/* Slide-up Stats Modal */}
      {activeStatsReel && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 100002, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={() => setActiveStatsReel(null)}>
          <div style={{ background: '#111827', width: '100%', height: '60%', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: 'white' }}>Post Insights</h3>
              <button onClick={() => setActiveStatsReel(null)} style={{ background: 'transparent', border: 'none', color: 'gray', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-times"></i></button>
            </div>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #374151', marginBottom: '15px' }}>
              <button onClick={() => setActiveStatsTab('views')} style={{ background: 'transparent', border: 'none', color: activeStatsTab === 'views' ? 'white' : 'gray', paddingBottom: '10px', borderBottom: activeStatsTab === 'views' ? '2px solid white' : 'none', fontWeight: 'bold', cursor: 'pointer' }}>Views ({statsData.viewers.length})</button>
              <button onClick={() => setActiveStatsTab('likes')} style={{ background: 'transparent', border: 'none', color: activeStatsTab === 'likes' ? 'white' : 'gray', paddingBottom: '10px', borderBottom: activeStatsTab === 'likes' ? '2px solid white' : 'none', fontWeight: 'bold', cursor: 'pointer' }}>Likes ({statsData.likes.length})</button>
              <button onClick={() => setActiveStatsTab('dislikes')} style={{ background: 'transparent', border: 'none', color: activeStatsTab === 'dislikes' ? 'white' : 'gray', paddingBottom: '10px', borderBottom: activeStatsTab === 'dislikes' ? '2px solid white' : 'none', fontWeight: 'bold', cursor: 'pointer' }}>Dislikes ({statsData.dislikes.length})</button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {statsData[activeStatsTab === 'views' ? 'viewers' : activeStatsTab].length === 0 ? (
                <p style={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>No users found.</p>
              ) : (
                statsData[activeStatsTab === 'views' ? 'viewers' : activeStatsTab].map((u: any, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.location.href = `/profile/${u.username}`}>
                    <img src={u.avatar} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>{u.username}</span>
                      <span style={{ color: 'gray', fontSize: '0.8rem' }}>{u.name}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

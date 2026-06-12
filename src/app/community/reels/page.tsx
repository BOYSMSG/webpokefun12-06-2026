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

  useEffect(() => {
    fetchReels();
  }, []);

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

  return (
    <div style={{ background: 'black', width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 10000, overflow: 'hidden' }}>
      {/* Global CSS to hide website layout elements */}
      <style>{`
        #gh-header, #nav, #footer, .desktop-sidebar-container, .global-sidebar-toggle, .global-sidebar, #ai-chat-widget {
          display: none !important;
        }
        .snap-container {
          height: 100vh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        .snap-container::-webkit-scrollbar {
          display: none;
        }
        .reel-item {
          height: 100vh;
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
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
        }
        .reel-actions {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
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
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          transition: transform 0.2s;
        }
        .action-btn:hover {
          transform: scale(1.1);
        }
        .action-text {
          font-size: 0.9rem;
          font-weight: bold;
        }
      `}</style>

      {/* Top Nav */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '20px 30px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '30px', zIndex: 10001, background: 'linear-gradient(rgba(0,0,0,0.8), transparent)' }}>
        <Link href="/community" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          <i className="fa-solid fa-arrow-left"></i> Community
        </Link>
        <button onClick={() => setShowAddModal(true)} style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(139,92,246,0.5)' }}>
          + Add Reel
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
          {reels.map(reel => (
            <div key={reel.id} className="reel-item">
              
              {/* Media Renderer */}
              {reel.mediaType === 'youtube' ? (
                <iframe src={reel.media} className="reel-media" style={{ border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              ) : reel.mediaType === 'instagram' ? (
                <iframe src={reel.media} className="reel-media" style={{ border: 'none' }} scrolling="no" allowTransparency></iframe>
              ) : (
                <video src={reel.media} className="reel-media" autoPlay loop muted playsInline controls={false} />
              )}

              {/* Overlay Content */}
              <div className="reel-overlay">
                <div style={{ color: 'white', paddingRight: '20px', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }} onClick={() => router.push(`/profile/${reel.authorUsername}`)}>
                    <img src={reel.avatar} alt={reel.author} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', cursor: 'pointer' }} />
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', textShadow: '0 1px 3px black' }}>@{reel.authorUsername}</span>
                  </div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', textShadow: '0 1px 3px black' }}>{reel.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8, textShadow: '0 1px 3px black' }}>{new Date(reel.timestamp).toLocaleDateString()}</p>
                </div>
                
                {/* Actions Sidebar */}
                <div className="reel-actions">
                  <button className="action-btn" onClick={() => handleInteract(reel.id, 'like')} style={{ color: reel.isLiked ? '#ef4444' : 'white' }}>
                    <i className="fa-solid fa-heart"></i>
                    <span className="action-text">{reel.upvotes}</span>
                  </button>
                  <button className="action-btn" onClick={() => { setActiveCommentsReel(reel.id); fetchComments(reel.id); }}>
                    <i className="fa-solid fa-comment-dots"></i>
                    <span className="action-text">Chat</span>
                  </button>
                  <button className="action-btn" onClick={() => handleInteract(reel.id, 'favorite')} style={{ color: reel.isSaved ? '#fbbf24' : 'white' }}>
                    <i className={reel.isSaved ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    <span className="action-text">Save</span>
                  </button>
                  <button className="action-btn" onClick={() => { navigator.clipboard.writeText(window.location.origin + '/community/post/' + reel.id); alert('Link copied!'); }}>
                    <i className="fa-solid fa-share"></i>
                    <span className="action-text">Share</span>
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
    </div>
  );
}

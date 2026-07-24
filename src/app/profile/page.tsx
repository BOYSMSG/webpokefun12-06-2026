"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editConnections, setEditConnections] = useState({
    minecraft: '', discord: '', youtube: '', instagram: '', google: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.email) {
      fetch(`/api/profile?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setProfile(data.user);
            setPosts(data.posts || []);
            setEditName(data.user.name);
            setEditUsername(data.user.username || '');
            setEditBio(data.user.bio || '');
            setEditConnections({
              minecraft: data.user.connections?.minecraft || '',
              discord: data.user.connections?.discord || '',
              youtube: data.user.connections?.youtube || '',
              instagram: data.user.connections?.instagram || '',
              google: data.user.connections?.google || ''
            });
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session, status, router]);

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editName, 
          username: editUsername, 
          bio: editBio,
          connections: editConnections
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update profile");
      }
    } catch (e) {
      alert("An error occurred");
    }
  };

  if (loading || status === 'loading') {
    return <div style={{ textAlign: 'center', marginTop: '100px', color: 'gray' }}>Loading Profile...</div>;
  }

  if (!profile) {
    return <div style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>Error loading profile</div>;
  }

  return (
    <div style={{ background: '#111827', minHeight: '100vh', width: '100%' }}>
      <div className="inner" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Profile Header */}
        <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.5))', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <img 
          src={profile.image || `https://ui-avatars.com/api/?name=${profile.name}&background=random`} 
          alt={profile.name} 
          style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #10b981', objectFit: 'cover' }} 
        />
        
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 5px 0', color: 'white' }}>{profile.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <i className="fa-solid fa-fingerprint"></i> ID: {profile.email}
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 15px 0', border: '1px solid #10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>{profile.role}</div>
          <p style={{ color: '#ccc', margin: '0 0 20px 0', lineHeight: 1.6, maxWidth: '600px' }}>{profile.bio || "A passionate Pokemon Trainer!"}</p>
          
          <div style={{ display: 'flex', gap: '20px', color: 'gray', fontSize: '0.9rem', marginBottom: '20px' }}>
            <span><strong style={{ color: 'white' }}>{posts.length}</strong> Posts</span>
            <span><strong style={{ color: 'white' }}>{profile.followers?.length || 0}</strong> Followers</span>
            <span><strong style={{ color: 'white' }}>{profile.following?.length || 0}</strong> Following</span>
          </div>

          {/* Reward Stats */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.4))', padding: '10px 20px', borderRadius: '10px', border: '1px solid #f59e0b', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-gem" style={{ color: '#f59e0b', fontSize: '1.5rem' }}></i>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#fcd34d' }}>Reward Points</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{profile.rewardPoints || 0}</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <div style={{ fontSize: '0.8rem', color: 'gray' }}>Reward Rank</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{profile.rewardRank || "Beginner"}</div>
            </div>
          </div>

          {/* Connections Display */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {profile.connections?.minecraft && (
              <span style={{ background: '#047857', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="fa-solid fa-cube"></i> Minecraft: {profile.connections.minecraft}
              </span>
            )}
            {profile.connections?.discord && (
              <span style={{ background: '#5865F2', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="fa-brands fa-discord"></i> Discord: {profile.connections.discord}
              </span>
            )}
            {profile.connections?.google && (
              <span style={{ background: '#DB4437', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="fa-brands fa-google"></i> Google: {profile.connections.google}
              </span>
            )}
            {profile.connections?.youtube && (
              <a href={`https://youtube.com/@${profile.connections.youtube.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ background: '#FF0000', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                <i className="fa-brands fa-youtube"></i> YouTube: {profile.connections.youtube}
              </a>
            )}
            {profile.connections?.instagram && (
              <a href={`https://instagram.com/${profile.connections.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ background: '#E1306C', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                <i className="fa-brands fa-instagram"></i> Instagram: {profile.connections.instagram}
              </a>
            )}
          </div>
        </div>

        <div>
          <button 
            onClick={() => setIsEditing(true)}
            style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={e => e.currentTarget.style.background = '#3b82f6'}
          >
            <i className="fa-solid fa-pen"></i> Edit Profile
          </button>
        </div>
      </div>

      {/* User Posts */}
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'white' }}>My Posts & Reels</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {posts.length === 0 ? (
          <p style={{ color: 'gray' }}>You haven't posted anything yet.</p>
        ) : (
          posts.map(post => (
            <div key={post._id} onClick={() => router.push(`/community/post/${post._id}`)} style={{ background: '#1f2937', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                {post.media && post.mediaType === 'image' && (
                  <img src={post.media} alt="Post media" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                )}
                {post.media && post.mediaType === 'video' && (
                  <video src={post.media} controls style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                )}
                {post.media && post.mediaType === 'youtube' && (
                  <iframe 
                    width="100%" 
                    height="150" 
                    src={post.media.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/").replace("autoplay=1", "autoplay=0")} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                )}
                {(!post.media) && (
                   <div style={{ width: '100%', height: '150px', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'gray' }}>
                     <i className="fa-solid fa-comment-dots" style={{ fontSize: '3rem' }}></i>
                   </div>
                )}
              <div style={{ padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', background: 'rgba(139,92,246,0.2)', color: '#c084fc', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>{post.category || 'Post'}</span>
                </div>
                <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>{post.title}</h4>
                <p style={{ color: 'gray', fontSize: '0.8rem', margin: 0 }}>{new Date(post.createdAt).toLocaleDateString()}</p>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '0.9rem', color: '#10b981' }}>
                  <span><i className="fa-solid fa-heart"></i> {post.likes?.length || 0}</span>
                  <span><i className="fa-solid fa-eye"></i> {post.views || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, overflowY: 'auto', padding: '20px' }}>
          <div style={{ background: '#1c1f21', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '550px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: 'white', margin: 0 }}>Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: 'gray', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'gray', marginBottom: '5px' }}>Display Name</label>
              <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#111', color: 'white' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'gray', marginBottom: '5px' }}>Pokefun Web ID (Username)</label>
              <input value={editUsername} onChange={e => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#111', color: 'white' }} placeholder="No spaces, only lowercase and numbers" />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'gray', marginBottom: '5px' }}>Bio</label>
              <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#111', color: 'white' }} />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '20px 0' }} />
            <h3 style={{ color: 'white', marginTop: 0, marginBottom: '15px', fontSize: '1.1rem' }}>Linked Accounts</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', color: 'gray', marginBottom: '5px', fontSize: '0.85rem' }}><i className="fa-solid fa-cube"></i> Minecraft</label>
                <input value={editConnections.minecraft} onChange={e => setEditConnections({...editConnections, minecraft: e.target.value})} placeholder="In-game name" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: 'white', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'gray', marginBottom: '5px', fontSize: '0.85rem' }}><i className="fa-brands fa-discord"></i> Discord</label>
                {editConnections.discord ? (
                  <input value={editConnections.discord} disabled title="Discord is automatically linked" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #333', background: '#222', color: 'gray', fontSize: '0.9rem', cursor: 'not-allowed' }} />
                ) : (
                  <button onClick={() => signIn('discord')} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: '#5865F2', color: 'white', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                    <i className="fa-brands fa-discord"></i> Connect Discord
                  </button>
                )}
              </div>
              <div>
                <label style={{ display: 'block', color: 'gray', marginBottom: '5px', fontSize: '0.85rem' }}><i className="fa-brands fa-youtube"></i> YouTube</label>
                <input value={editConnections.youtube} onChange={e => setEditConnections({...editConnections, youtube: e.target.value})} placeholder="Channel name" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: 'white', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'gray', marginBottom: '5px', fontSize: '0.85rem' }}><i className="fa-brands fa-instagram"></i> Instagram</label>
                <input value={editConnections.instagram} onChange={e => setEditConnections({...editConnections, instagram: e.target.value})} placeholder="@username" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: 'white', fontSize: '0.9rem' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', color: 'gray', marginBottom: '5px', fontSize: '0.85rem' }}><i className="fa-brands fa-google"></i> Google/Gmail</label>
                {editConnections.google ? (
                  <input value={editConnections.google} disabled title="Gmail is automatically linked" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #333', background: '#222', color: 'gray', fontSize: '0.9rem', cursor: 'not-allowed' }} />
                ) : (
                  <button onClick={() => signIn('google')} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: '#DB4437', color: 'white', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                    <i className="fa-brands fa-google"></i> Connect Google
                  </button>
                )}
              </div>
            </div>

            <button onClick={handleSaveProfile} style={{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

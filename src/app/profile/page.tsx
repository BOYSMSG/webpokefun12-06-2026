"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');

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
            setEditBio(data.user.bio || '');
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
        body: JSON.stringify({ name: editName, bio: editBio })
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
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
          <p style={{ color: '#10b981', fontWeight: 'bold', margin: '0 0 15px 0' }}>{profile.role}</p>
          <p style={{ color: '#ccc', margin: '0 0 20px 0', lineHeight: 1.6, maxWidth: '600px' }}>{profile.bio || "A passionate Pokemon Trainer!"}</p>
          
          <div style={{ display: 'flex', gap: '20px', color: 'gray', fontSize: '0.9rem' }}>
            <span><strong style={{ color: 'white' }}>{posts.length}</strong> Posts</span>
            <span><strong style={{ color: 'white' }}>{profile.followers?.length || 0}</strong> Followers</span>
            <span><strong style={{ color: 'white' }}>{profile.following?.length || 0}</strong> Following</span>
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
                    src={post.media.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: '#1c1f21', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: 'white', margin: 0 }}>Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: 'gray', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'gray', marginBottom: '5px' }}>Display Name</label>
              <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#111', color: 'white' }} />
            </div>



            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', color: 'gray', marginBottom: '5px' }}>Bio</label>
              <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#111', color: 'white' }} />
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

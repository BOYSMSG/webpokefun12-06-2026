"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PublicProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profile/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setProfile(data.profile);
          setPosts(data.posts || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleFollow = async () => {
    if (!session) return alert("Please login to follow!");
    try {
      const res = await fetch(`/api/profile/${profile.email}/follow`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setProfile({ 
          ...profile, 
          followersCount: data.followersCount
        });
        alert(data.isFollowing ? "You are now following this user!" : "You unfollowed this user.");
      }
    } catch (e) {
      alert("Failed to update follow status.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'gray' }}>Loading profile...</div>;
  if (!profile) return <div style={{ textAlign: 'center', marginTop: '100px', color: '#ef4444' }}>User not found!</div>;

  return (
    <div style={{ background: '#111827', minHeight: '100vh', width: '100%' }}>
      <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Banner & Avatar Container */}
      <div style={{ position: 'relative', marginBottom: '80px' }}>
        {/* Banner */}
        <div style={{ height: '250px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', opacity: 0.3 }}></div>
        </div>
        
        {/* Avatar */}
        <div style={{ position: 'absolute', bottom: '-50px', left: '50px', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
          <img 
            src={profile.image} 
            alt={profile.name} 
            style={{ width: '130px', height: '130px', borderRadius: '50%', border: '6px solid #111', background: '#111', objectFit: 'cover' }} 
          />
        </div>
        
        {/* Action Buttons */}
        <div style={{ position: 'absolute', bottom: '-40px', right: '20px', display: 'flex', gap: '15px' }}>
          {session?.user?.email !== profile.email ? (
            <>
              <button onClick={handleFollow} style={{ padding: '10px 25px', borderRadius: '30px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                <i className="fa-solid fa-user-plus"></i> Follow
              </button>
              <Link href="/messages" style={{ padding: '10px 25px', borderRadius: '30px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}>
                <i className="fa-solid fa-message"></i> Message
              </Link>
            </>
          ) : (
            <Link href="/profile" style={{ padding: '10px 25px', borderRadius: '30px', border: 'none', background: '#374151', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <i className="fa-solid fa-pen"></i> Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div style={{ padding: '0 30px', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {profile.name}
          {profile.email === "msgboys832@gmail.com" && (
            <span style={{ fontSize: '1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold', border: '1px solid rgba(239,68,68,0.5)' }}>
              👑 OWNER
            </span>
          )}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-fingerprint"></i> ID: {profile.email}
        </p>
        
        <p style={{ color: '#d1d5db', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px', marginBottom: '25px' }}>
          {profile.bio}
        </p>

        <div style={{ display: 'flex', gap: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '20px 0' }}>
          <div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{profile.followersCount}</span>
            <span style={{ color: 'gray', marginLeft: '8px' }}>Followers</span>
          </div>
          <div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{profile.followingCount}</span>
            <span style={{ color: 'gray', marginLeft: '8px' }}>Following</span>
          </div>
          <div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{posts.length}</span>
            <span style={{ color: 'gray', marginLeft: '8px' }}>Posts</span>
          </div>
        </div>
      </div>

      {/* User's Posts Feed */}
      <div style={{ padding: '0 30px' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '20px' }}>Recent Posts</h2>
        
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', color: 'gray' }}>
            This user hasn't posted anything yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {posts.map(post => (
              <div key={post.id} onClick={() => router.push(`/community/post/${post.id}`)} style={{ background: '#1f2937', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
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
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(139,92,246,0.2)', color: '#c084fc', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>{post.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '10px' }}>{post.title}</h3>
                  <p style={{ color: 'gray', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      </div>
    </div>
  );
}

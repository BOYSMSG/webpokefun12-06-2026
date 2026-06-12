import React from 'react';
import Link from 'next/link';

export default function CommunityGuidePage() {
  return (
    <div className="inner" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      <div style={{ marginBottom: '30px' }}>
        <Link href="/" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fa-solid fa-arrow-left"></i> Back Home
        </Link>
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#f97316', marginBottom: '10px' }}>
        <i className="fa-solid fa-book-open"></i> Community Guide
      </h1>
      <p style={{ color: 'gray', fontSize: '1.1rem', marginBottom: '40px' }}>Learn how to post, upload videos, and interact in the Pokefun Community.</p>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}><i className="fa-solid fa-camera"></i> How to Create a Post</h2>
        <ol style={{ lineHeight: '1.8', color: '#e5e7eb', fontSize: '1.05rem', marginLeft: '20px' }}>
          <li>Go to the main <strong>Community</strong> page.</li>
          <li>Click the <strong>"Create Post"</strong> button at the top of the feed.</li>
          <li>Write a catchy title for your post.</li>
          <li>Select <strong>"Image"</strong> as your post type.</li>
          <li>Enter a valid image URL. Make sure it ends with .jpg or .png.</li>
          <li>Click <strong>"Post"</strong> to share it with everyone!</li>
        </ol>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '15px' }}><i className="fa-solid fa-video"></i> How to Upload a Video (Reel)</h2>
        <ol style={{ lineHeight: '1.8', color: '#e5e7eb', fontSize: '1.05rem', marginLeft: '20px' }}>
          <li>On the Community page, click <strong>"Create Post"</strong>.</li>
          <li>Select the <strong>"Reel"</strong> (Video) tab.</li>
          <li>You can either enter a direct video link (.mp4) OR upload a video directly.</li>
          <li>Note: Video uploads have a maximum size limit of <strong>150MB</strong> to save Google Drive storage.</li>
          <li>Once uploaded, the video will automatically play in the main feed for all players.</li>
        </ol>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#10b981', marginBottom: '15px' }}><i className="fa-solid fa-shield-halved"></i> Community Rules</h2>
        <ul style={{ lineHeight: '1.8', color: '#e5e7eb', fontSize: '1.05rem', marginLeft: '20px' }}>
          <li>Be respectful to all trainers.</li>
          <li>No NSFW, offensive, or illegal content.</li>
          <li>Do not spam the feed with repetitive posts.</li>
          <li>Moderators have the right to delete your posts, warn you, or ban your account if you break the rules.</li>
        </ul>
      </div>
    </div>
  );
}

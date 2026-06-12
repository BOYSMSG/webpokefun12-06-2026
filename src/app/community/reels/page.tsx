"use client";

import React from 'react';

export default function ReelsPage() {
  return (
    <div style={{ background: '#0a0a0a', width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 10000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Top Navigation */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '30px', display: 'flex', alignItems: 'center', zIndex: 10001 }}>
        <a href="/community" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-arrow-left"></i> Back to Community
        </a>
      </div>

      <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
        <i className="fa-solid fa-film" style={{ fontSize: '5rem', color: '#8b5cf6', marginBottom: '20px' }}></i>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 10px 0' }}>Pokefun Reels</h1>
        <p style={{ fontSize: '1.2rem', color: 'gray', maxWidth: '500px', margin: '0 auto 30px auto' }}>
          We are currently upgrading our storage systems to handle high-quality video reels for all players. This feature will be back online soon!
        </p>
        <div style={{ display: 'inline-block', background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', border: '1px solid rgba(139, 92, 246, 0.5)' }}>
          Coming Soon
        </div>
      </div>

      <style>{`
        #gh-header, #nav, #footer, .desktop-sidebar-container, .global-sidebar-toggle, .global-sidebar, #ai-chat-widget {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

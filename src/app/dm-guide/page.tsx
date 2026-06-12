import React from 'react';
import Link from 'next/link';

export default function DMGuidePage() {
  return (
    <div className="inner" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      <div style={{ marginBottom: '30px' }}>
        <Link href="/" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fa-solid fa-arrow-left"></i> Back Home
        </Link>
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#06b6d4', marginBottom: '10px' }}>
        <i className="fa-solid fa-comments"></i> Direct Message (DM) Guide
      </h1>
      <p style={{ color: 'gray', fontSize: '1.1rem', marginBottom: '40px' }}>Learn how to privately chat with other players safely.</p>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}><i className="fa-solid fa-paper-plane"></i> How to Send a DM</h2>
        <ol style={{ lineHeight: '1.8', color: '#e5e7eb', fontSize: '1.05rem', marginLeft: '20px' }}>
          <li>Open the <strong>Messages</strong> tab from the top navigation bar or the floating widget.</li>
          <li>Click on a player's name from the <strong>Online Users</strong> or <strong>All Users</strong> list.</li>
          <li>Type your message in the chat box at the bottom.</li>
          <li>Press Enter or click the Send button to deliver your message instantly!</li>
        </ol>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#f59e0b', marginBottom: '15px' }}><i className="fa-solid fa-bell"></i> Notifications & Online Status</h2>
        <ul style={{ lineHeight: '1.8', color: '#e5e7eb', fontSize: '1.05rem', marginLeft: '20px' }}>
          <li>When you receive a new DM, a <strong>Red Dot</strong> will appear on the Pokefun floating widget.</li>
          <li>You will also get an alert in the <strong>Alerts</strong> menu. Clicking it will take you straight to the chat!</li>
          <li>Players who are currently active on the site will have a <span style={{ color: '#10b981', fontWeight: 'bold' }}>Green Online</span> badge next to their name.</li>
          <li>Players who are offline will show as <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Offline</span>.</li>
        </ul>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '15px' }}><i className="fa-solid fa-user-secret"></i> Privacy & Moderation</h2>
        <ul style={{ lineHeight: '1.8', color: '#e5e7eb', fontSize: '1.05rem', marginLeft: '20px' }}>
          <li>Remember that Admins and Staff monitor the server to keep everyone safe.</li>
          <li><strong>Do NOT share personal information</strong> like your real address, passwords, or phone numbers in DMs.</li>
          <li>If you receive an inappropriate message, please report the player to an Admin immediately.</li>
          <li>If you break the rules in DMs, you may receive a <strong>System Warning</strong> from the Moderation Team.</li>
        </ul>
      </div>
    </div>
  );
}

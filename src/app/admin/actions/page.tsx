"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminActionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated' || !['ADMIN', 'STAFF'].includes((session?.user as any)?.role)) {
      router.push('/admin');
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/actions/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleBanToggle = async (email: string, isCurrentlyBanned: boolean) => {
    if (!confirm(`Are you sure you want to ${isCurrentlyBanned ? 'unban' : 'ban'} ${email}?`)) return;

    const res = await fetch('/api/admin/actions/ban', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, isBanned: !isCurrentlyBanned })
    });
    
    if (res.ok) {
      setUsers(users.map(u => u.email === email ? { ...u, isBanned: !isCurrentlyBanned } : u));
    } else {
      alert("Failed to update ban status");
    }
  };

  const handleWarn = async (email: string) => {
    const warningText = prompt(`Enter warning message to send to ${email}:`);
    if (!warningText) return;

    const res = await fetch('/api/admin/actions/warn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, message: warningText })
    });
    
    if (res.ok) {
      alert("Warning sent successfully via System DM!");
    } else {
      alert("Failed to send warning");
    }
  };

  const handleClearPosts = async (email: string) => {
    if (!confirm(`WARNING: Are you sure you want to delete ALL posts by ${email}? This cannot be undone.`)) return;

    const res = await fetch('/api/admin/actions/clear-posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (res.ok) {
      setUsers(users.map(u => u.email === email ? { ...u, postCount: 0 } : u));
      alert(`Successfully deleted all posts from ${email}.`);
    } else {
      alert("Failed to clear posts.");
    }
  };

  if (loading || status === 'loading') return <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>Loading Users Data...</div>;

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <button onClick={() => router.push('/admin')} style={{ background: 'transparent', border: '1px solid #444', color: 'white', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', margin: 0 }}>User Actions & Moderation</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {users.length === 0 ? (
          <p style={{ color: 'gray' }}>No users found.</p>
        ) : (
          users.map(u => (
            <div key={u._id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
              {u.isBanned && (
                <div style={{ position: 'absolute', top: 10, right: -30, background: '#ef4444', color: 'white', padding: '5px 30px', transform: 'rotate(45deg)', fontWeight: 'bold', fontSize: '0.8rem', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  BANNED
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`} alt={u.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #3b82f6' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</h3>
                  <p style={{ margin: 0, color: 'gray', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</p>
                  <p style={{ margin: '5px 0 0 0', color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>Posts: {u.postCount}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button 
                  onClick={() => handleBanToggle(u.email, !!u.isBanned)}
                  style={{ padding: '10px', background: u.isBanned ? '#10b981' : 'rgba(239, 68, 68, 0.2)', color: u.isBanned ? 'white' : '#ef4444', border: u.isBanned ? 'none' : '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <i className={`fa-solid ${u.isBanned ? 'fa-check' : 'fa-ban'}`}></i> {u.isBanned ? 'Unban' : 'Ban'}
                </button>
                
                <button 
                  onClick={() => handleWarn(u.email)}
                  style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-triangle-exclamation"></i> Warn
                </button>

                <button 
                  onClick={() => router.push(`/messages?user=${encodeURIComponent(u.email)}`)}
                  style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-envelope"></i> DM
                </button>

                <button 
                  onClick={() => handleClearPosts(u.email)}
                  disabled={u.postCount === 0}
                  style={{ padding: '10px', background: u.postCount === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(239, 68, 68, 0.8)', color: u.postCount === 0 ? 'gray' : 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: u.postCount === 0 ? 'not-allowed' : 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i> Clear Posts
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

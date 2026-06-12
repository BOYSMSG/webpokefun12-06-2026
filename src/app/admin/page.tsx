"use client";

import React, { useState, useEffect } from 'react';
import { signIn, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto redirect if not admin but logged in
  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      twoFactorCode
    });

    if (res?.error) {
      setError('Invalid credentials or 2FA code.');
    } else {
      setError('');
    }
    setLoading(false);
  };

  if (status === 'loading') return <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>Loading...</div>;

  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'ADMIN') {
    return (
      <div className="inner" style={{ paddingTop: '120px', paddingBottom: '60px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <i className="fa-solid fa-lock" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '20px' }}></i>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '30px' }}>Admin Login</h1>
        
        <form onSubmit={handleLogin} style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {error && <p style={{ color: '#ef4444', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}
          
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white', outline: 'none' }}
            />
          </div>
          
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>2FA Security Code (Optional)</label>
            <input 
              type="text" 
              placeholder="Leave blank if 2FA is disabled"
              value={twoFactorCode} 
              onChange={e => setTwoFactorCode(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white', outline: 'none', textAlign: 'center', letterSpacing: '2px', fontSize: '1.2rem', fontWeight: 'bold' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#ef4444', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#ef4444' }}>Admin Dashboard</h1>
          <p style={{ color: 'gray' }}>Welcome back, {(session?.user as any)?.name}. Manage Community Posts, Videos, and Staff Roles</p>
        </div>
        <button onClick={() => signOut()} style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
          <i className="fa-solid fa-users" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '15px' }}></i>
          <h2>Manage Staff</h2>
          <p style={{ color: 'gray', marginBottom: '15px' }}>Assign permissions to other users so they can moderate the community feed.</p>
          <button onClick={() => router.push('/admin/users')} style={{ padding: '8px 15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>View Users</button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
          <i className="fa-solid fa-hammer" style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '15px' }}></i>
          <h2>User Actions</h2>
          <p style={{ color: 'gray', marginBottom: '15px' }}>Ban users, clear all posts, or send official system warnings to players.</p>
          <button onClick={() => router.push('/admin/actions')} style={{ padding: '8px 15px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Manage Actions</button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
          <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2rem', color: '#8b5cf6', marginBottom: '15px' }}></i>
          <h2>Google Drive Storage</h2>
          <p style={{ color: 'gray', marginBottom: '15px' }}>Check your storage limits for 150MB video uploads and images.</p>
          <button style={{ padding: '8px 15px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Storage Settings</button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
          <i className="fa-solid fa-user-secret" style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '15px' }}></i>
          <h2 style={{ color: '#ef4444' }}>Spy on DMs</h2>
          <p style={{ color: 'gray', marginBottom: '15px' }}>Monitor all private direct messages sent between players on the server.</p>
          <button onClick={() => router.push('/admin/messages')} style={{ padding: '8px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Spy DMs</button>
        </div>
      </div>
    </div>
  );
}

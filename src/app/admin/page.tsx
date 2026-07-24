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

  const myRole = (session?.user as any)?.role;
  const myPermissions = (session?.user as any)?.permissions || [];
  
  const isPrivileged = myRole === 'OWNER' || myRole === 'ADMIN' || myRole === 'SUB_ADMIN' || myRole === 'STAFF' || myPermissions.length > 0;
  const canManageRoles = myRole === 'OWNER' || myRole === 'ADMIN' || myPermissions.includes('MANAGE_ROLES');
  const canBanUsers = myRole === 'OWNER' || myRole === 'ADMIN' || myPermissions.includes('BAN_USERS');
  const canReadDMs = myRole === 'OWNER' || myRole === 'ADMIN' || myPermissions.includes('READ_DMS');
  const canManageGiveawaysPolls = myRole === 'OWNER' || myRole === 'ADMIN' || myPermissions.includes('MANAGE_GIVEAWAYS_POLLS');
  const canManageEventsTourneys = myRole === 'OWNER' || myRole === 'ADMIN' || myPermissions.includes('MANAGE_EVENTS_TOURNAMENTS');

  // Auto redirect if not privileged but logged in
  useEffect(() => {
    if (status === 'authenticated' && !isPrivileged) {
      router.push('/');
    }
  }, [status, isPrivileged, router]);

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

  if (status === 'unauthenticated' || !isPrivileged) {
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
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#ef4444' }}>Staff Dashboard</h1>
          <p style={{ color: 'gray' }}>Welcome back, {(session?.user as any)?.name}. Role: <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{myRole}</span></p>
        </div>
        <button onClick={() => signOut()} style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {canManageRoles && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
            <i className="fa-solid fa-users" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '15px' }}></i>
            <h2>Manage Staff</h2>
            <p style={{ color: 'gray', marginBottom: '15px' }}>Assign permissions to other users so they can moderate the community feed.</p>
            <button onClick={() => router.push('/admin/users')} style={{ padding: '8px 15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>View Users</button>
          </div>
        )}

        {canBanUsers && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
            <i className="fa-solid fa-hammer" style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '15px' }}></i>
            <h2>User Actions</h2>
            <p style={{ color: 'gray', marginBottom: '15px' }}>Ban users, clear all posts, or send official system warnings to players.</p>
            <button onClick={() => router.push('/admin/actions')} style={{ padding: '8px 15px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Manage Actions</button>
          </div>
        )}

        {canManageGiveawaysPolls && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
            <i className="fa-solid fa-gift" style={{ fontSize: '2rem', color: '#e74c3c', marginBottom: '15px' }}></i>
            <h2>Manage Giveaways & Polls</h2>
            <p style={{ color: 'gray', marginBottom: '15px' }}>View active giveaways and secretly rig winners from behind the scenes.</p>
            <button onClick={() => router.push('/admin/giveaways')} style={{ padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Manage Giveaways</button>
          </div>
        )}

        {canManageEventsTourneys && (
          <>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
              <i className="fa-solid fa-calendar-star" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '15px' }}></i>
              <h2>Manage Events</h2>
              <p style={{ color: 'gray', marginBottom: '15px' }}>View all events and see participants.</p>
              <button onClick={() => router.push('/admin/events')} style={{ padding: '8px 15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Manage Events</button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
              <i className="fa-solid fa-trophy" style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '15px' }}></i>
              <h2>Manage Tournaments</h2>
              <p style={{ color: 'gray', marginBottom: '15px' }}>View all tournaments and see participants.</p>
              <button onClick={() => router.push('/admin/tournaments')} style={{ padding: '8px 15px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Manage Tournaments</button>
            </div>
          </>
        )}

        {(myRole === 'OWNER' || myRole === 'ADMIN') && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
            <i className="fa-solid fa-dumbbell" style={{ fontSize: '2rem', color: '#10b981', marginBottom: '15px' }}></i>
            <h2>Manage Gyms</h2>
            <p style={{ color: 'gray', marginBottom: '15px' }}>Review gym leader applications, approve/reject them, and manage gym leaders.</p>
            <button onClick={() => router.push('/admin/gyms')} style={{ padding: '8px 15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Manage Gyms</button>
          </div>
        )}

        {(myRole === 'OWNER' || myRole === 'ADMIN') && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
            <i className="fa-solid fa-store" style={{ fontSize: '2rem', color: '#facc15', marginBottom: '15px' }}></i>
            <h2>Store Configuration</h2>
            <p style={{ color: 'gray', marginBottom: '15px' }}>Turn the store sale banner on or off, configure the discount amount, and set the timer.</p>
            <button onClick={() => router.push('/admin/store-config')} style={{ padding: '8px 15px', background: '#facc15', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Manage Store Config</button>
          </div>
        )}

        {(myRole === 'OWNER' || myRole === 'ADMIN') && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
            <i className="fa-solid fa-gem" style={{ fontSize: '2rem', color: '#ec4899', marginBottom: '15px' }}></i>
            <h2 style={{ color: '#ec4899' }}>Rewards Economy</h2>
            <p style={{ color: 'gray', marginBottom: '15px' }}>Manage reward products, pricing, stock, and view the global rewards economy.</p>
            <button onClick={() => router.push('/admin/rewards')} style={{ padding: '8px 15px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Manage Rewards</button>
          </div>
        )}

        {canManageRoles && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2rem', color: '#8b5cf6', marginBottom: '15px' }}></i>
            <h2>Storage</h2>
            <p style={{ color: 'gray', marginBottom: '15px' }}>Check your storage limits for server uploads.</p>
            <button style={{ padding: '8px 15px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Storage Settings</button>
          </div>
        )}

        {canReadDMs && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
            <i className="fa-solid fa-user-secret" style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '15px' }}></i>
            <h2 style={{ color: '#ef4444' }}>Spy on DMs</h2>
            <p style={{ color: 'gray', marginBottom: '15px' }}>Monitor all private direct messages sent between players on the server.</p>
            <button onClick={() => router.push('/admin/messages')} style={{ padding: '8px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Spy DMs</button>
          </div>
        )}

        {!canManageRoles && !canBanUsers && !canReadDMs && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'gray' }}>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: '3rem', marginBottom: '20px', color: '#4b5563' }}></i>
            <p>You do not have any specific administrative dashboard permissions assigned.</p>
            <p>Return to the community feed to use your standard moderation tools.</p>
            <button onClick={() => router.push('/community')} style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Go to Community</button>
          </div>
        )}

      </div>
    </div>
  );
}

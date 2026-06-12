"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user as any)?.role !== 'ADMIN') {
      router.push('/admin');
      return;
    }

    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session, status, router]);

  const handleMakeAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to make ${email} an Admin?`)) return;

    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role: 'ADMIN' })
    });
    
    if (res.ok) {
      setUsers(users.map(u => u.email === email ? { ...u, role: 'ADMIN' } : u));
      alert(`Success! ${email} is now an Admin.`);
    } else {
      alert("Failed to update user role");
    }
  };

  const handleDemote = async (email: string) => {
    if (!confirm(`Are you sure you want to demote ${email} to User?`)) return;

    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role: 'USER' })
    });
    
    if (res.ok) {
      setUsers(users.map(u => u.email === email ? { ...u, role: 'USER' } : u));
      alert(`Success! ${email} is now a normal User.`);
    } else {
      alert("Failed to update user role");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || status === 'loading') return <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>Loading Users...</div>;

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <button onClick={() => router.push('/admin')} style={{ background: 'transparent', border: '1px solid #444', color: 'white', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6', margin: 0 }}>Manage Staff & Users</h1>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search users by name or email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '15px 20px', borderRadius: '12px', border: '1px solid #444', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none', fontSize: '1rem' }}
        />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid #444', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead style={{ background: 'rgba(0,0,0,0.5)' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #444' }}>Avatar</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #444' }}>Name</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #444' }}>Email</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #444' }}>Role</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #444' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px' }}>
                  <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                </td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{u.name}</td>
                <td style={{ padding: '15px', color: 'gray' }}>{u.email}</td>
                <td style={{ padding: '15px' }}>
                  {u.role === 'ADMIN' ? (
                    <button 
                      onClick={() => handleDemote(u.email)}
                      style={{ padding: '8px 15px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Demote to User
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleMakeAdmin(u.email)}
                      style={{ padding: '8px 15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Make Admin
                    </button>
                  )}
                </td>
                <td style={{ padding: '15px', color: 'gray' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

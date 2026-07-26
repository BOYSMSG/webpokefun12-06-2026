"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const PERMISSIONS_LIST = [
  { id: 'DELETE_POSTS', label: 'Delete Posts' },
  { id: 'ANNOUNCEMENTS', label: 'Post Announcements/Guides' },
  { id: 'MANAGE_ROLES', label: 'Manage Roles & Staff' },
  { id: 'READ_DMS', label: 'Read Player DMs (Spy)' },
  { id: 'BAN_USERS', label: 'Ban & Warn Users' },
  { id: 'MANAGE_GIVEAWAYS_POLLS', label: 'Manage Giveaways & Polls' },
  { id: 'MANAGE_EVENTS_TOURNAMENTS', label: 'Manage Events & Tournaments' },
  { id: 'MANAGE_REWARDS_STORE', label: 'Manage Rewards & Store' }
];

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editRole, setEditRole] = useState('');
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const myRole = (session?.user as any)?.role;
  const myPermissions = (session?.user as any)?.permissions || [];
  const canManageRoles = myRole === 'OWNER' || myRole === 'ADMIN' || myPermissions.includes('MANAGE_ROLES');

  useEffect(() => {
    if (status === 'unauthenticated' || !canManageRoles) {
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
  }, [session, status, router, canManageRoles]);

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditPermissions(user.permissions || []);
  };

  const togglePermission = (permId: string) => {
    setEditPermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    
    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: editingUser.email, 
        role: editRole,
        permissions: editPermissions
      })
    });
    
    if (res.ok) {
      const updated = await res.json();
      setUsers(users.map(u => u.email === updated.email ? updated : u));
      setEditingUser(null);
      alert(`Success! Updated permissions for ${updated.name}.`);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update user");
    }
    setSaving(false);
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

      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid #444', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', minWidth: '600px' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: u.role === 'OWNER' ? '#ff4757' : u.role === 'ADMIN' ? '#3b82f6' : u.role === 'SUB_ADMIN' ? '#10b981' : u.role === 'STAFF' ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>{u.role}</span>
                    <button 
                      onClick={() => openEditModal(u)}
                      style={{ padding: '6px 12px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      <i className="fa-solid fa-pen"></i> Edit
                    </button>
                  </div>
                </td>
                <td style={{ padding: '15px', color: 'gray' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1f2937', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '500px', border: '1px solid #374151', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '1.5rem' }}>Edit Staff: {editingUser.name}</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'gray', marginBottom: '10px', fontWeight: 'bold' }}>Select Role</label>
              <select 
                value={editRole} 
                onChange={e => setEditRole(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '8px', color: 'white', outline: 'none' }}
              >
                <option value="USER">USER</option>
                <option value="STAFF">STAFF</option>
                <option value="SUB_ADMIN">SUB_ADMIN</option>
                <option value="ADMIN">ADMIN</option>
                {myRole === 'OWNER' && <option value="OWNER">OWNER</option>}
              </select>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', color: 'gray', marginBottom: '15px', fontWeight: 'bold' }}>Specific Permissions</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {PERMISSIONS_LIST.map(perm => (
                  <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={editPermissions.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                    />
                    {perm.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setEditingUser(null)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #4b5563', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

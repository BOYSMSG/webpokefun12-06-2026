"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminGiveawaysPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [giveaways, setGiveaways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [rigInputs, setRigInputs] = useState<{ [id: string]: string }>({});
  const [saving, setSaving] = useState<{ [id: string]: boolean }>({});

  const myRole = (session?.user as any)?.role;
  const isAdmin = myRole === 'OWNER' || myRole === 'ADMIN';

  useEffect(() => {
    if (status === 'authenticated') {
      if (!isAdmin) {
        router.push('/');
      } else {
        fetchGiveaways();
      }
    }
  }, [status, isAdmin, router]);

  const fetchGiveaways = async () => {
    try {
      const res = await fetch('/api/admin/giveaways');
      const data = await res.json();
      if (data.success) {
        setGiveaways(data.giveaways);
        const initialInputs: any = {};
        data.giveaways.forEach((gw: any) => {
          initialInputs[gw._id] = gw.forceWinner || '';
        });
        setRigInputs(initialInputs);
      } else {
        setError(data.error || 'Failed to load giveaways');
      }
    } catch (err) {
      setError('An error occurred while fetching giveaways.');
    }
    setLoading(false);
  };

  const handleRigChange = (id: string, value: string) => {
    setRigInputs(prev => ({ ...prev, [id]: value }));
  };

  const saveForceWinner = async (id: string) => {
    setSaving(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch('/api/admin/giveaways', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, forceWinner: rigInputs[id] })
      });
      const data = await res.json();
      if (data.success) {
        alert('Giveaway rigging updated successfully!');
        fetchGiveaways(); // refresh list
      } else {
        alert(data.error || 'Failed to update');
      }
    } catch (err) {
      alert('Error saving force winner');
    }
    setSaving(prev => ({ ...prev, [id]: false }));
  };

  const forceEndGiveaway = async (id: string) => {
    if (!confirm('Are you sure you want to forcefully end this giveaway and roll winners right now?')) return;
    try {
      const res = await fetch('/api/admin/giveaways', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'force_end' })
      });
      const data = await res.json();
      if (data.success) {
        alert('Giveaway force ended! Winners will be rolled automatically on next fetch.');
        fetchGiveaways();
      } else {
        alert(data.error || 'Failed to force end');
      }
    } catch (err) {
      alert('Error force ending giveaway');
    }
  };

  const deleteGiveaway = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this giveaway?')) return;
    try {
      const res = await fetch('/api/admin/giveaways', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        alert('Giveaway deleted successfully.');
        fetchGiveaways();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting giveaway');
    }
  };

  if (status === 'loading' || loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>Loading admin data...</div>;
  if (!isAdmin) return null;

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => router.push('/admin')} style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
        <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444', marginBottom: '10px' }}>Manage Giveaways</h1>
      <p style={{ color: 'gray', marginBottom: '30px' }}>View all active and past giveaways. You can silently rig active giveaways by setting a force winner, force end them early, or delete them entirely.</p>

      {error && <div style={{ background: '#ef4444', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {giveaways.length === 0 ? (
          <p style={{ color: 'gray', textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>No giveaways found.</p>
        ) : (
          giveaways.map((gw) => {
            const isActive = gw.status === 'ACTIVE';
            return (
              <div key={gw._id} style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid #444', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ color: '#1cc6db', margin: '0 0 5px 0' }}>{gw.prize}</h2>
                    <p style={{ color: 'gray', margin: 0, fontSize: '0.9rem' }}>Created by {gw.createdBy} | Ends: {new Date(gw.expiresAt).toLocaleString()}</p>
                  </div>
                  <span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: isActive ? '#10b981' : '#ef4444' }}>
                    {gw.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#a3a3a3', marginBottom: '10px' }}>Participants ({gw.participants.length})</h3>
                    <div style={{ maxHeight: '100px', overflowY: 'auto', fontSize: '0.9rem', color: '#fff' }}>
                      {gw.participants.length > 0 ? gw.participants.join(', ') : 'No entries yet.'}
                    </div>
                  </div>

                  {isActive ? (
                    <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '15px', borderRadius: '10px', border: '1px dashed #e74c3c' }}>
                      <h3 style={{ fontSize: '1rem', color: '#e74c3c', marginBottom: '5px' }}>Rig Giveaway (Secret)</h3>
                      <p style={{ fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '10px' }}>Enter username to force them to win.</p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          placeholder="Leave blank for random"
                          value={rigInputs[gw._id] || ''}
                          onChange={(e) => handleRigChange(gw._id, e.target.value)}
                          style={{ flex: 1, padding: '10px', borderRadius: '6px', background: '#111', border: '1px solid #e74c3c', color: '#fff' }}
                        />
                        <button 
                          onClick={() => saveForceWinner(gw._id)}
                          disabled={saving[gw._id]}
                          style={{ padding: '10px 20px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', cursor: saving[gw._id] ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                        >
                          {saving[gw._id] ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
                      <h3 style={{ fontSize: '1rem', color: '#10b981', marginBottom: '10px' }}>Winners</h3>
                      <p style={{ color: '#fff', fontWeight: 'bold' }}>{gw.winners.length > 0 ? gw.winners.join(', ') : 'No winners.'}</p>
                      {gw.forceWinner && (
                         <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '10px' }}>* Rigged for: {gw.forceWinner}</p>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                  {isActive && (
                    <button onClick={() => forceEndGiveaway(gw._id)} style={{ padding: '8px 15px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                      <i className="fa-solid fa-stopwatch"></i> Force End
                    </button>
                  )}
                  <button onClick={() => deleteGiveaway(gw._id)} style={{ padding: '8px 15px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <i className="fa-solid fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

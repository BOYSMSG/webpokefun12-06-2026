"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminTournamentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const myRole = (session?.user as any)?.role;
  const myPermissions = (session?.user as any)?.permissions || [];
  const isAdmin = myRole === 'OWNER' || myRole === 'ADMIN' || myPermissions.includes('MANAGE_EVENTS_TOURNAMENTS');

  useEffect(() => {
    if (status === 'authenticated') {
      if (!isAdmin) {
        router.push('/');
      } else {
        fetchTournaments();
      }
    }
  }, [status, isAdmin, router]);

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      if (data.success) {
        setTournaments(data.tournaments);
      } else {
        setError(data.error || 'Failed to load tournaments');
      }
    } catch (err) {
      setError('An error occurred while fetching tournaments.');
    }
    setLoading(false);
  };

  const forceEndTournament = async (id: string) => {
    if (!confirm('Are you sure you want to forcefully end this tournament?')) return;
    try {
      const res = await fetch('/api/tournaments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId: id, action: 'FORCE_END' })
      });
      const data = await res.json();
      if (data.success) {
        alert('Tournament force ended!');
        fetchTournaments();
      } else {
        alert(data.error || 'Failed to force end');
      }
    } catch (err) {
      alert('Error force ending tournament');
    }
  };

  const deleteTournament = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this tournament?')) return;
    try {
      const res = await fetch('/api/tournaments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId: id })
      });
      const data = await res.json();
      if (data.success) {
        alert('Tournament deleted successfully.');
        fetchTournaments();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting tournament');
    }
  };

  if (status === 'loading' || loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>Loading admin data...</div>;
  if (!isAdmin) return null;

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => router.push('/admin')} style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
        <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', marginBottom: '10px' }}>Manage Tournaments</h1>
      <p style={{ color: 'gray', marginBottom: '30px' }}>View all active and past tournaments. You can see who joined, force end them early, or delete them entirely.</p>

      {error && <div style={{ background: '#ef4444', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {tournaments.length === 0 ? (
          <p style={{ color: 'gray', textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>No tournaments found.</p>
        ) : (
          tournaments.map((t) => {
            const isOngoing = t.status === 'ONGOING';
            const isUpcoming = t.status === 'UPCOMING';
            const isActive = isOngoing || isUpcoming;

            return (
              <div key={t._id} style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid #444', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ color: '#f59e0b', margin: '0 0 5px 0' }}>{t.name}</h2>
                    <p style={{ color: 'gray', margin: 0, fontSize: '0.9rem' }}>Created by {t.createdBy} | Date: {new Date(t.eventDate).toLocaleString()}</p>
                  </div>
                  <span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', background: isActive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: isActive ? '#f59e0b' : '#ef4444' }}>
                    {t.status}
                  </span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
                  <h3 style={{ fontSize: '1rem', color: '#a3a3a3', marginBottom: '10px' }}>Applicants ({t.applicants?.length || 0} / {t.maxPlayers})</h3>
                  <div style={{ maxHeight: '100px', overflowY: 'auto', fontSize: '0.9rem', color: '#fff' }}>
                    {t.applicants && t.applicants.length > 0 ? t.applicants.join(', ') : 'No entries yet.'}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                  {isActive && (
                    <button onClick={() => forceEndTournament(t._id)} style={{ padding: '8px 15px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                      <i className="fa-solid fa-stopwatch"></i> Force End
                    </button>
                  )}
                  <button onClick={() => deleteTournament(t._id)} style={{ padding: '8px 15px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
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

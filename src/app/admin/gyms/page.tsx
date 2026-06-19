"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminGymsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<{ [id: string]: boolean }>({});

  const myRole = (session?.user as any)?.role;
  const isAdmin = myRole === 'OWNER' || myRole === 'ADMIN';

  useEffect(() => {
    if (status === 'authenticated') {
      if (!isAdmin) {
        router.push('/');
      } else {
        fetchData();
      }
    }
  }, [status, isAdmin, router]);

  const fetchData = async () => {
    try {
      const [appRes, gymRes] = await Promise.all([
        fetch('/api/gyms/applications'),
        fetch('/api/gyms')
      ]);
      const appData = await appRes.json();
      const gymData = await gymRes.json();
      
      if (appData.success) setApplications(appData.applications);
      if (gymData.success) setGyms(gymData.gyms);
      
      if (!appData.success && !gymData.success) {
        setError('Failed to load data');
      }
    } catch (err) {
      setError('An error occurred while fetching data.');
    }
    setLoading(false);
  };

  const handleAction = async (applicationId: string, actionStatus: 'APPROVED' | 'REJECTED') => {
    const actionName = actionStatus.toLowerCase();
    const reason = prompt(`Enter a message/reason for ${actionName} this application (Optional):`);
    if (reason === null) return; // User cancelled

    if (!confirm(`Are you sure you want to ${actionName} this application?`)) return;

    setProcessing(prev => ({ ...prev, [applicationId]: true }));
    try {
      const res = await fetch('/api/gyms/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: actionStatus, reason })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Application successfully ${actionStatus.toLowerCase()}`);
        fetchData(); // refresh list
      } else {
        alert(data.error || `Failed to ${actionStatus.toLowerCase()}`);
      }
    } catch (err) {
      alert(`Error processing application`);
    }
    setProcessing(prev => ({ ...prev, [applicationId]: false }));
  };

  const handleRevoke = async (gymId: string) => {
    const reason = prompt("Enter the reason for revoking this Gym Leader:");
    if (!reason) return;

    if (!confirm(`Are you absolutely sure you want to revoke this leader? They will be removed immediately.`)) return;

    setProcessing(prev => ({ ...prev, [gymId]: true }));
    try {
      const res = await fetch('/api/gyms/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gymId, reason })
      });
      const data = await res.json();
      if (data.success) {
        alert('Gym Leader successfully revoked.');
        fetchData(); // refresh list
      } else {
        alert(data.error || 'Failed to revoke Gym Leader');
      }
    } catch (err) {
      alert(`Error revoking gym leader`);
    }
    setProcessing(prev => ({ ...prev, [gymId]: false }));
  };

  const handleEditRules = async (gymId: string, currentRules: string) => {
    const rules = prompt("Enter the rules for this gym (shown to challengers):", currentRules || "");
    if (rules === null) return;

    setProcessing(prev => ({ ...prev, [gymId]: true }));
    try {
      const res = await fetch('/api/gyms/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gymId, rules })
      });
      const data = await res.json();
      if (data.success) {
        alert('Rules updated successfully.');
        fetchData();
      } else {
        alert(data.error || 'Failed to update rules');
      }
    } catch (err) {
      alert(`Error updating rules`);
    }
    setProcessing(prev => ({ ...prev, [gymId]: false }));
  };

  if (status === 'loading' || loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>Loading admin data...</div>;
  if (!isAdmin) return null;

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => router.push('/admin')} style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
        <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginBottom: '10px' }}>Manage Gyms & Leaders</h1>
      <p style={{ color: 'gray', marginBottom: '30px' }}>Review applications, approve new leaders, and manage or revoke existing Gym Leaders.</p>

      {error && <div style={{ background: '#ef4444', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>Current Gym Leaders</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {gyms.filter(g => g.status === 'BOOKED').length === 0 ? (
            <p style={{ color: 'gray' }}>No active Gym Leaders found.</p>
          ) : (
            gyms.filter(g => g.status === 'BOOKED').map((gym) => (
              <div key={gym._id} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid #444' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1cc6db' }}>{gym.name}</h3>
                <p style={{ margin: '5px 0', color: 'gray' }}><strong>Leader:</strong> <span style={{ color: '#fff' }}>{gym.leaderUsername}</span></p>
                <p style={{ margin: '5px 0 15px 0', color: 'gray' }}><strong>Type:</strong> {gym.type}</p>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleEditRules(gym._id, gym.rules)}
                    disabled={processing[gym._id]}
                    style={{ flex: 1, padding: '10px', background: 'transparent', color: '#10b981', border: '1px solid #10b981', borderRadius: '6px', cursor: processing[gym._id] ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                  >
                    Edit Rules
                  </button>
                  <button 
                    onClick={() => handleRevoke(gym._id)}
                    disabled={processing[gym._id]}
                    style={{ flex: 1, padding: '10px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: processing[gym._id] ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                  >
                    {processing[gym._id] ? 'Processing...' : 'Revoke'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>Pending Applications</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {applications.length === 0 ? (
            <p style={{ color: 'gray', textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>No pending applications found.</p>
          ) : (
            applications.map((app) => {
              const isPending = app.status === 'PENDING';
              const gymName = app.gymId?.name || 'Unknown Gym';
              
              return (
                <div key={app._id} style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid #444', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ color: '#1cc6db', margin: '0 0 5px 0' }}>{app.applicantUsername} <span style={{ fontSize: '1rem', color: 'gray' }}>applied for</span> {gymName}</h2>
                      <p style={{ color: 'gray', margin: 0, fontSize: '0.9rem' }}>Submitted: {new Date(app.createdAt).toLocaleString()}</p>
                    </div>
                    <span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', 
                      background: app.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : app.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', 
                      color: app.status === 'APPROVED' ? '#10b981' : app.status === 'REJECTED' ? '#ef4444' : '#f59e0b' }}>
                      {app.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
                      <h3 style={{ fontSize: '1rem', color: '#a3a3a3', marginBottom: '10px' }}>Player Information</h3>
                      <p style={{ color: '#fff', margin: '5px 0' }}><strong>Discord:</strong> {app.discordTag}</p>
                      <p style={{ color: '#fff', margin: '5px 0' }}><strong>Minecraft IGN:</strong> {app.minecraftIgn}</p>
                      <p style={{ color: '#fff', margin: '5px 0' }}><strong>Timezone:</strong> {app.timezone}</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
                      <h3 style={{ fontSize: '1rem', color: '#a3a3a3', marginBottom: '10px' }}>Application Details</h3>
                      <p style={{ color: '#fff', margin: '5px 0', fontSize: '0.9rem' }}><strong>Experience:</strong><br/>{app.experience}</p>
                      <p style={{ color: '#fff', margin: '5px 0', fontSize: '0.9rem', marginTop: '10px' }}><strong>Reason:</strong><br/>{app.reason}</p>
                      <p style={{ color: '#fff', margin: '5px 0', fontSize: '0.9rem', marginTop: '10px' }}><strong>Team Draft:</strong><br/>{app.teamDraft}</p>
                    </div>
                  </div>

                  {isPending && (
                    <div style={{ display: 'flex', gap: '15px', marginTop: '15px', justifyContent: 'flex-end', borderTop: '1px solid #333', paddingTop: '15px' }}>
                      <button 
                        onClick={() => handleAction(app._id, 'REJECTED')}
                        disabled={processing[app._id]}
                        style={{ padding: '10px 20px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: processing[app._id] ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                      >
                        {processing[app._id] ? 'Processing...' : 'Reject Application'}
                      </button>
                      <button 
                        onClick={() => handleAction(app._id, 'APPROVED')}
                        disabled={processing[app._id]}
                        style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: processing[app._id] ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                      >
                        {processing[app._id] ? 'Processing...' : 'Approve & Appoint Leader'}
                      </button>
                    </div>
                  )}

                  {!isPending && (
                    <div style={{ marginTop: '10px', color: 'gray', fontSize: '0.9rem', textAlign: 'right' }}>
                      Reviewed by {app.reviewedBy}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

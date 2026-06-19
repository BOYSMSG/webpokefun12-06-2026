"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminGymsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
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
        fetchApplications();
      }
    }
  }, [status, isAdmin, router]);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/gyms/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      } else {
        setError(data.error || 'Failed to load applications');
      }
    } catch (err) {
      setError('An error occurred while fetching applications.');
    }
    setLoading(false);
  };

  const handleAction = async (applicationId: string, actionStatus: 'APPROVED' | 'REJECTED') => {
    if (!confirm(`Are you sure you want to ${actionStatus.toLowerCase()} this application?`)) return;

    setProcessing(prev => ({ ...prev, [applicationId]: true }));
    try {
      const res = await fetch('/api/gyms/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: actionStatus })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Application successfully ${actionStatus.toLowerCase()}`);
        fetchApplications(); // refresh list
      } else {
        alert(data.error || `Failed to ${actionStatus.toLowerCase()}`);
      }
    } catch (err) {
      alert(`Error processing application`);
    }
    setProcessing(prev => ({ ...prev, [applicationId]: false }));
  };

  if (status === 'loading' || loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>Loading admin data...</div>;
  if (!isAdmin) return null;

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => router.push('/admin')} style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
        <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginBottom: '10px' }}>Manage Gym Applications</h1>
      <p style={{ color: 'gray', marginBottom: '30px' }}>Review applications submitted by players for the Gym Leader positions. Approving an application will automatically set them as the gym leader and reject all other pending applications for that gym.</p>

      {error && <div style={{ background: '#ef4444', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

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
  );
}

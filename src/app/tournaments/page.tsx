"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";

export default function TournamentsPage() {
  const { data: session } = useSession();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Tournament State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('32');
  const [eventDate, setEventDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    fetchTournaments();
    if (session?.user?.role === 'ADMIN' || session?.user?.role === 'OWNER') {
       setIsAdmin(true);
    }
  }, [session]);

  const fetchTournaments = () => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTournaments(data.tournaments);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, rules, maxPlayers, eventDate, imageUrl })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setName(''); setDescription(''); setRules(''); setMaxPlayers('32'); setEventDate(''); setImageUrl('');
        fetchTournaments();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Something went wrong");
    }
    setCreateLoading(false);
  };

  const handleAction = async (tournamentId: string, action: 'APPLY' | 'APPROVE', targetUsername?: string) => {
    const loadingKey = `${tournamentId}-${action}-${targetUsername || 'me'}`;
    setActionLoading({ ...actionLoading, [loadingKey]: true });
    
    try {
      const res = await fetch('/api/tournaments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId, action, targetUsername })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchTournaments();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Something went wrong");
    }
    setActionLoading({ ...actionLoading, [loadingKey]: false });
  };

  const renderTournament = (t: any) => {
    const hasApplied = session?.user?.username && t.applicants.includes(session.user.username);
    const isApproved = session?.user?.username && t.approvedPlayers.includes(session.user.username);

    return (
      <div key={t._id} style={{ background: "rgba(30, 34, 39, 0.7)", borderRadius: "12px", padding: "25px", marginBottom: "20px", border: "1px solid #333", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
          <div>
            <h3 style={{ margin: 0, color: "#fbbf24", fontSize: "1.5rem", fontWeight: 800 }}>
              <i className="fa-solid fa-trophy"></i> {t.name}
            </h3>
            <p style={{ color: "#a3a3a3", marginTop: "5px", fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>{t.description}</p>
          </div>
          <span style={{ 
            background: t.status === 'UPCOMING' ? "rgba(52, 152, 219, 0.2)" : t.status === 'ONGOING' ? "rgba(46, 204, 113, 0.2)" : "rgba(231, 76, 60, 0.2)", 
            color: t.status === 'UPCOMING' ? "#3498db" : t.status === 'ONGOING' ? "#2ecc71" : "#e74c3c", 
            padding: "4px 10px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" 
          }}>
            {t.status}
          </span>
        </div>
        
        {t.imageUrl && (
          <div style={{ marginBottom: "20px", width: "100%", maxHeight: "300px", overflow: "hidden", borderRadius: "8px" }}>
            <img src={t.imageUrl} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px", fontSize: "0.9rem" }}>
          <div style={{ background: "#222", padding: "12px", borderRadius: "8px" }}>
            <div style={{ color: "#888", marginBottom: "5px" }}><i className="fa-regular fa-calendar"></i> Date</div>
            <div style={{ color: "#fff", fontWeight: "bold" }}>{new Date(t.eventDate).toLocaleDateString()} at {new Date(t.eventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
          <div style={{ background: "#222", padding: "12px", borderRadius: "8px" }}>
            <div style={{ color: "#888", marginBottom: "5px" }}><i className="fa-solid fa-users"></i> Players</div>
            <div style={{ color: "#fff", fontWeight: "bold" }}>{t.approvedPlayers.length} / {t.maxPlayers}</div>
          </div>
        </div>

        {t.rules && (
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <div style={{ color: "#fff", fontWeight: "bold", marginBottom: "5px" }}>Rules</div>
            <div style={{ color: "#a3a3a3", fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>{t.rules}</div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#888", fontSize: "0.9rem" }}>Hosted by {t.createdBy}</div>
          
          {t.status === 'UPCOMING' && (
            <button 
              onClick={() => handleAction(t._id, 'APPLY')}
              disabled={hasApplied || isApproved || !session?.user || t.approvedPlayers.length >= t.maxPlayers}
              style={{ 
                background: isApproved ? "#2ecc71" : hasApplied ? "#f39c12" : "#fbbf24", 
                color: isApproved || hasJoined ? "#fff" : "#000", 
                border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", 
                cursor: (hasApplied || isApproved || !session?.user || t.approvedPlayers.length >= t.maxPlayers) ? "not-allowed" : "pointer"
              }}
            >
              {!session?.user ? "Login to Apply" : isApproved ? "Approved! See you there" : hasApplied ? "Application Pending" : t.approvedPlayers.length >= t.maxPlayers ? "Tournament Full" : "Apply to Join"}
            </button>
          )}
        </div>

        {t.status === 'COMPLETED' && t.winners && (t.winners.first || t.winners.second || t.winners.third) && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,215,0,0.1)', border: '1px solid #f1c40f', borderRadius: '10px' }}>
            <h4 style={{ color: '#f1c40f', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-trophy"></i> Winners
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {t.winners.first && <div><span style={{ color: '#ffd700', fontWeight: 'bold' }}>1st Place:</span> {t.winners.first}</div>}
              {t.winners.second && <div><span style={{ color: '#c0c0c0', fontWeight: 'bold' }}>2nd Place:</span> {t.winners.second}</div>}
              {t.winners.third && <div><span style={{ color: '#cd7f32', fontWeight: 'bold' }}>3rd Place:</span> {t.winners.third}</div>}
            </div>
            {t.endMessage && (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(241, 196, 15, 0.3)', color: '#fff', fontSize: '0.9rem', fontStyle: 'italic' }}>
                "{t.endMessage}"
              </div>
            )}
          </div>
        )}

        {/* Admin Section */}
        {isAdmin && t.status === 'UPCOMING' && t.applicants.length > 0 && (
          <div style={{ marginTop: "20px", borderTop: "1px solid #444", paddingTop: "20px" }}>
            <h4 style={{ color: "#fff", margin: "0 0 15px 0" }}>Pending Applications ({t.applicants.length})</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {t.applicants.map((applicant: string) => (
                <div key={applicant} style={{ background: "#222", padding: "10px 15px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "15px" }}>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>{applicant}</span>
                  <button 
                    onClick={() => handleAction(t._id, 'APPROVE', applicant)}
                    disabled={actionLoading[`${t._id}-APPROVE-${applicant}`]}
                    style={{ background: "#2ecc71", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}
                  >
                    {actionLoading[`${t._id}-APPROVE-${applicant}`] ? "..." : "Approve"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const hasJoined = false; // Dummy, already handled inside render

  return (
    <>
      <Head>
        <title>Tournaments - Pokefun</title>
      </Head>
      
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#fbbf24", margin: 0 }}>
              Tournaments
            </h1>
            <p style={{ color: "#a3a3a3", margin: "5px 0 0 0" }}>Battle the best and earn exclusive rewards!</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{ background: "#fbbf24", color: "#000", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <i className="fa-solid fa-plus"></i> Create Tournament
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#a3a3a3", padding: "40px" }}>Loading Tournaments...</div>
        ) : tournaments.length === 0 ? (
          <div style={{ textAlign: "center", background: "#1c1f21", padding: "40px", borderRadius: "12px", color: "#888" }}>
            <i className="fa-solid fa-trophy" style={{ fontSize: "3rem", marginBottom: "15px", opacity: 0.5 }}></i>
            <h2>No active tournaments</h2>
            <p>Train your Pokemon, the next tournament will be announced soon!</p>
          </div>
        ) : (
          <div>{tournaments.map(renderTournament)}</div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && isAdmin && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ background: "#222", borderRadius: "12px", width: "100%", maxWidth: "500px", border: "2px solid #fbbf24" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, color: "#fff", fontSize: "1.5rem", fontWeight: "bold" }}><i className="fa-solid fa-trophy"></i> Create Tournament</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", color: "#888", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateTournament} style={{ padding: "20px", maxHeight: "70vh", overflowY: "auto" }}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Tournament Name *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333", color: "#fff" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Description *</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333", color: "#fff", resize: "none", minHeight: "60px" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Image URL (Optional)</label>
                <input type="text" placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333", color: "#fff" }} />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Rules / Prizes</label>
                <textarea value={rules} onChange={e => setRules(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333", color: "#fff", resize: "none", minHeight: "60px" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Max Players *</label>
                  <input required type="number" min="2" value={maxPlayers} onChange={e => setMaxPlayers(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333", color: "#fff" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Event Date & Time *</label>
                  <input required type="datetime-local" value={eventDate} onChange={e => setEventDate(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333", color: "#fff" }} />
                </div>
              </div>

              <button type="submit" disabled={createLoading} style={{ width: "100%", background: "#fbbf24", color: "#000", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "bold", fontSize: "1.1rem", cursor: createLoading ? "not-allowed" : "pointer" }}>
                {createLoading ? "Creating..." : "Create Tournament"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

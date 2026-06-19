"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";

export default function GiveawaysPage() {
  const { data: session } = useSession();
  const [giveaways, setGiveaways] = useState<any[]>([]);
  const [prize, setPrize] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [winnersCount, setWinnersCount] = useState(1);
  const [durationHours, setDurationHours] = useState(24);

  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [forceWinner, setForceWinner] = useState('');
  const [joinLoading, setJoinLoading] = useState<Record<string, boolean>>({});

  const [isAdmin, setIsAdmin] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchGiveaways = async () => {
    try {
      const res = await fetch('/api/giveaways');
      const data = await res.json();
      if (data.success) setGiveaways(data.giveaways);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGiveaways();
    if (session?.user) {
      setIsAdmin(['OWNER', 'ADMIN'].includes((session.user as any).role));
    }
  }, [session]);

  const handleCreateGiveaway = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch('/api/giveaways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prize, description, winnersCount, durationHours })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setPrize('');
        setDescription('');
        setWinnersCount('1');
        setForceWinner('');
        fetchGiveaways();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Something went wrong");
    }
    setCreateLoading(false);
  };

  const handleJoin = async (giveawayId: string) => {
    setJoinLoading({ ...joinLoading, [giveawayId]: true });
    try {
      const res = await fetch('/api/giveaways/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giveawayId })
      });
      const data = await res.json();
      if (data.success) {
        fetchGiveaways(); // Refresh to show participation
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Something went wrong");
    }
    setJoinLoading({ ...joinLoading, [giveawayId]: false });
  };

  const renderGiveaway = (gw: any) => {
    const hasJoined = session?.user?.username && gw.participants.includes(session.user.username);

    return (
      <div key={gw._id} style={{ background: "linear-gradient(to bottom right, #2a2e33, #1c1f21)", borderRadius: "12px", padding: "25px", marginBottom: "20px", border: "1px solid #444", position: "relative", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
          <div>
            <h3 style={{ margin: 0, color: "var(--ghost-accent-color)", fontSize: "1.5rem", fontWeight: 800 }}>
              <i className="fa-solid fa-gift"></i> {gw.prize}
            </h3>
            <p style={{ color: "#a3a3a3", marginTop: "5px", fontSize: "0.95rem" }}>{gw.description}</p>
          </div>
          {gw.status === 'ACTIVE' ? (
            <span style={{ background: "rgba(46, 204, 113, 0.2)", color: "#2ecc71", padding: "4px 10px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" }}>ACTIVE</span>
          ) : (
            <span style={{ background: "rgba(231, 76, 60, 0.2)", color: "#e74c3c", padding: "4px 10px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" }}>ENDED</span>
          )}
        </div>
        
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", fontSize: "0.9rem" }}>
          <div style={{ background: "#222", padding: "10px 15px", borderRadius: "8px", flex: 1, textAlign: "center" }}>
            <div style={{ color: "#888", marginBottom: "5px" }}>Winners</div>
            <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.2rem" }}>{gw.winnersCount}</div>
          </div>
          <div style={{ background: "#222", padding: "10px 15px", borderRadius: "8px", flex: 1, textAlign: "center" }}>
            <div style={{ color: "#888", marginBottom: "5px" }}>Entries</div>
            <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.2rem" }}>{gw.participants.length}</div>
          </div>
          <div style={{ background: "#222", padding: "10px 15px", borderRadius: "8px", flex: 1, textAlign: "center" }}>
            <div style={{ color: "#888", marginBottom: "5px" }}>Hosted By</div>
            <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.2rem" }}>{gw.createdBy}</div>
          </div>
        </div>

        {gw.status === 'ENDED' && gw.winners.length > 0 && (
          <div style={{ background: "rgba(251, 191, 36, 0.1)", border: "1px solid #fbbf24", padding: "15px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
            <div style={{ color: "#fbbf24", fontWeight: "bold", marginBottom: "5px" }}><i className="fa-solid fa-trophy"></i> Winners</div>
            <div style={{ color: "#fff", fontSize: "1.1rem" }}>{gw.winners.join(", ")}</div>
          </div>
        )}

        {isAdmin && gw.status === 'ACTIVE' && (
          <div style={{ background: "rgba(231, 76, 60, 0.1)", border: "1px dashed #e74c3c", padding: "10px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.8rem", color: "#e74c3c" }}>
            <strong>Admin Secret Info:</strong> Force Winner set to: {gw.forceWinner || 'None (Random)'}
          </div>
        )}

        {gw.status === 'ACTIVE' && (
          <button 
            onClick={() => handleJoin(gw._id)}
            disabled={joinLoading[gw._id] || hasJoined || !session?.user}
            style={{ 
              width: "100%", background: hasJoined ? "#444" : "var(--ghost-accent-color)", 
              color: hasJoined ? "#888" : "#000", border: "none", padding: "12px", 
              borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem",
              cursor: (joinLoading[gw._id] || hasJoined || !session?.user) ? "not-allowed" : "pointer"
            }}
          >
            {!session?.user ? "Login to Join" : hasJoined ? "You're Entered!" : joinLoading[gw._id] ? "Joining..." : "Join Giveaway"}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Giveaways - Pokefun</title>
      </Head>
      
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "var(--ghost-accent-color)", margin: 0 }}>
              Giveaways
            </h1>
            <p style={{ color: "#a3a3a3", margin: "5px 0 0 0" }}>Enter to win exclusive Pokemon, items, and ranks!</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{ background: "#e74c3c", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <i className="fa-solid fa-plus"></i> Host Giveaway
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#a3a3a3", padding: "40px" }}>Loading Giveaways...</div>
        ) : giveaways.length === 0 ? (
          <div style={{ textAlign: "center", background: "#1c1f21", padding: "40px", borderRadius: "12px", color: "#888" }}>
            <i className="fa-solid fa-gift" style={{ fontSize: "3rem", marginBottom: "15px", opacity: 0.5 }}></i>
            <h2>No active giveaways</h2>
            <p>We'll host more soon! Keep an eye on our Discord announcements.</p>
          </div>
        ) : (
          <div>{giveaways.map(renderGiveaway)}</div>
        )}
      </div>

      {/* Create Giveaway Modal (Admin Only) */}
      {showCreateModal && isAdmin && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ background: "#222", borderRadius: "12px", width: "100%", maxWidth: "500px", border: "2px solid #e74c3c" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, color: "#fff", fontSize: "1.5rem", fontWeight: "bold" }}><i className="fa-solid fa-gift"></i> Host Giveaway</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", color: "#888", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateGiveaway} style={{ padding: "20px" }}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Prize Name *</label>
                <input required type="text" placeholder="e.g. Shiny Charizard" value={prize} onChange={e => setPrize(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333", color: "#fff" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Description</label>
                <textarea placeholder="e.g. Level 100, Perfect IVs" value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333", color: "#fff", resize: "none", minHeight: "60px" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Winners Count *</label>
                  <input required type="number" min="1" value={winnersCount} onChange={e => setWinnersCount(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333", color: "#fff" }} />
                </div>
                <div>
                  <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Duration *</label>
                  <select value={durationHours} onChange={e => setDurationHours(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333", color: "#fff" }}>
                    <option value="1">1 hour</option>
                    <option value="24">24 hours</option>
                    <option value="72">3 days</option>
                    <option value="168">1 week</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={createLoading} style={{ width: "100%", background: "#e74c3c", color: "#fff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "bold", fontSize: "1.1rem", cursor: createLoading ? "not-allowed" : "pointer" }}>
                {createLoading ? "Creating..." : "Start Giveaway"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

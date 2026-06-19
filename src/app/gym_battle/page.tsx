"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";

export default function GymBattlePage() {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGym, setSelectedGym] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    teamLink: ''
  });
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/gyms')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGyms(data.gyms);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGym?.rules && !agreedToRules) {
      setMessage('error: You must agree to the gym rules before challenging.');
      return;
    }
    setSubmitLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/gyms/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, gymId: selectedGym._id })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage('success: ' + data.message);
        setSelectedGym(null);
        setFormData({ date: '', time: '', teamLink: '' });
        setAgreedToRules(false);
      } else {
        setMessage('error: ' + data.error);
      }
    } catch (err) {
      setMessage('error: Something went wrong.');
    }
    setSubmitLoading(false);
  };

  const getGymColor = (type: string) => {
    const colors: any = {
      Normal: '#A8A77A', Fire: '#EE8130', Water: '#6390F0', Electric: '#F7D02C',
      Grass: '#7AC74C', Ice: '#96D9D6', Fighting: '#C22E28', Poison: '#A33EA1',
      Ground: '#E2BF65', Flying: '#A98FF3', Psychic: '#F95587', Bug: '#A6B91A',
      Rock: '#B6A136', Ghost: '#735797', Dragon: '#6F35FC', Dark: '#705848',
      Steel: '#B7B7CE', Fairy: '#D685AD'
    };
    return colors[type] || '#fff';
  };

  return (
    <>
      <Head>
        <title>Gym Battles - Pokefun</title>
      </Head>
      
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "var(--ghost-accent-color)" }}>Challenge Gym Leaders</h1>
          <p style={{ color: "#a3a3a3", maxWidth: "600px", margin: "10px auto" }}>
            Ready to earn your badges? Select an active Gym Leader below and request a battle appointment.
          </p>
        </div>

        {message && (
          <div style={{ 
            padding: "15px", 
            marginBottom: "30px", 
            borderRadius: "8px", 
            background: message.startsWith('success') ? "rgba(46, 204, 113, 0.2)" : "rgba(231, 76, 60, 0.2)",
            color: message.startsWith('success') ? "#2ecc71" : "#e74c3c",
            textAlign: "center",
            fontWeight: "bold"
          }}>
            {message.substring(message.indexOf(':') + 1).trim()}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", color: "#a3a3a3", padding: "40px" }}>Loading Gyms...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {gyms.map(gym => (
              <div key={gym._id} style={{ 
                background: "rgba(30, 34, 39, 0.7)", 
                borderTop: `4px solid ${getGymColor(gym.type)}`,
                borderRadius: "12px", 
                padding: "20px", 
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
              }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "1.5rem" }}>{gym.name}</h3>
                <div style={{ display: "inline-block", background: getGymColor(gym.type), color: "#fff", padding: "3px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "15px" }}>
                  {gym.type} Type
                </div>
                <p style={{ margin: "0 0 15px 0", color: "#a3a3a3", fontSize: "0.9rem" }}>Badge: <span style={{ color: "#fff" }}>{gym.badgeName}</span></p>
                <p style={{ margin: "0 0 20px 0", color: "#a3a3a3", fontSize: "0.9rem" }}>
                  Leader: <span style={{ color: gym.leaderUsername ? "var(--ghost-accent-color)" : "#e74c3c", fontWeight: "bold" }}>{gym.leaderUsername || "No Leader Yet"}</span>
                </p>
                
                {gym.status !== 'BOOKED' ? (
                  <button disabled style={{ width: "100%", background: "#444", color: "#888", border: "none", padding: "10px", borderRadius: "6px", cursor: "not-allowed", fontWeight: "bold" }}>
                    Leader Required
                  </button>
                ) : (
                  <button 
                    onClick={() => setSelectedGym(gym)}
                    style={{ width: "100%", background: getGymColor(gym.type), color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "transform 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <i className="fa-solid fa-khanda"></i> Appoint Battle
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Challenge Modal */}
      {selectedGym && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ background: "#1c1f21", borderRadius: "12px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", position: "relative", border: `2px solid ${getGymColor(selectedGym.type)}` }}>
            <button 
              onClick={() => setSelectedGym(null)}
              style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", color: "#a3a3a3", fontSize: "1.5rem", cursor: "pointer" }}
            >
              &times;
            </button>
            <div style={{ padding: "30px" }}>
              <h2 style={{ margin: "0 0 10px 0", color: "#fff" }}>Challenge {selectedGym.name}</h2>
              <p style={{ color: "#a3a3a3", fontSize: "0.9rem", marginBottom: "20px" }}>
                Leader: <strong style={{ color: "var(--ghost-accent-color)" }}>{selectedGym.leaderUsername}</strong>
              </p>
              
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                  <div>
                    <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Date *</label>
                    <input required type="date" name="date" value={formData.date} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#2a2e33", border: "1px solid #444", color: "#fff" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Time *</label>
                    <input required type="time" name="time" value={formData.time} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#2a2e33", border: "1px solid #444", color: "#fff" }} />
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", color: "#a3a3a3", marginBottom: "5px", fontSize: "0.9rem" }}>Notes / Team Link (Optional)</label>
                  <textarea name="teamLink" placeholder="Any specific rules or links to your pokepaste?" rows={3} value={formData.teamLink} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "#2a2e33", border: "1px solid #444", color: "#fff", resize: "vertical" }}></textarea>
                </div>

                {selectedGym.rules && (
                  <div style={{ marginBottom: "20px", background: "rgba(245, 158, 11, 0.1)", border: "1px solid #f59e0b", borderRadius: "8px", padding: "15px" }}>
                    <h4 style={{ color: "#f59e0b", margin: "0 0 10px 0" }}>Must Read</h4>
                    <p style={{ color: "#e5e7eb", fontSize: "0.9rem", whiteSpace: "pre-wrap", margin: "0 0 15px 0" }}>{selectedGym.rules}</p>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        required 
                        checked={agreedToRules} 
                        onChange={(e) => setAgreedToRules(e.target.checked)} 
                        style={{ width: "18px", height: "18px", accentColor: "#f59e0b" }} 
                      />
                      <span style={{ color: "#a3a3a3", fontSize: "0.85rem" }}>I readed all info and fee structure for gym battle</span>
                    </label>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={submitLoading || (selectedGym.rules && !agreedToRules)}
                  style={{ width: "100%", background: "var(--ghost-accent-color)", color: "#000", border: "none", padding: "12px", borderRadius: "6px", cursor: submitLoading || (selectedGym.rules && !agreedToRules) ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "1.1rem" }}
                >
                  {submitLoading ? "Sending..." : "Send Challenge"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

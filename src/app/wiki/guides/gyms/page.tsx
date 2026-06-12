import React from "react";

export default function GymsGuidePage() {
  return (
    <div className="fakemon-card" style={{ padding: "40px" }}>
      <img src="/images/features/image13_customeforms.png" alt="gyms" className="guide-banner-img" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} />
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "20px" }}>Gyms Guide</h1>
      <div style={{ marginTop: "30px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px", color: "var(--accent-cyan)" }}>Gym Progression Flow</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid var(--accent-cyan)" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>1. Gain Required Total Wins</h3>
            <p style={{ color: "#ccc", lineHeight: "1.6" }}>
              Before entering a Gym, you must prove yourself against regular trainers on the map (like F-Tier or E-Tier).
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid var(--accent-cyan)" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>2. Defeat the Gym Entrance Trainers</h3>
            <p style={{ color: "#ccc", lineHeight: "1.6" }}>
              Once you meet the Total Wins requirement, the Gym unlocks! Inside, you must defeat the 3 Entrance Trainers (NPCs).
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid var(--accent-cyan)" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>3. Challenge the Sub Gym Leader (NPC)</h3>
            <p style={{ color: "#ccc", lineHeight: "1.6" }}>
              After taking out all 3 Entrance Trainers, the Sub Gym Leader will accept your challenge.
              <br /><br />
              Defeating this NPC is crucial. They will reward you with a special 1st Generation Pokemon Item which acts as your Official Gym Pass!
              <br /><br />
              <strong style={{ color: "var(--accent-gold)" }}>NPC Lv 100 | Player Max Lv 70</strong>
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid var(--accent-cyan)" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>4. Battle the REAL Gym Leader (Player)</h3>
            <p style={{ color: "#ccc", lineHeight: "1.6" }}>
              Take the Pass (Special Item) you just earned and give it to the REAL PLAYER Gym Leader! (Give gym leader entrance fee - on discord you can check those details). 
              <br /><br />
              Defeat them in a true PvP battle to earn your Gym Badge and top-tier rewards!
            </p>
          </div>

        </div>

        <div style={{ marginTop: "40px", padding: "20px", background: "rgba(236, 72, 153, 0.1)", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(236, 72, 153, 0.3)" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-secondary)", marginBottom: "10px" }}>Elite 4 Coming Soon...</h2>
          <p style={{ color: "#ccc" }}>Prepare your strongest teams. The ultimate challenge awaits.</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function GymsNpcsPage() {
  const gyms = [
    { name: "Grass Gym", leader: "Milo", badge: "Grass Badge", level: "10-20" },
    { name: "Water Gym", leader: "Nessa", badge: "Water Badge", level: "20-30" },
    { name: "Fire Gym", leader: "Kabu", badge: "Fire Badge", level: "30-40" },
    { name: "Dragon Gym", leader: "Raihan", badge: "Dragon Badge", level: "40-50" },
  ];

  return (
    <div style={{ padding: "100px 20px 60px", maxWidth: "1200px", margin: "0 auto" }}>
      <Link href="/wiki" style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "var(--accent-cyan)", marginBottom: "30px", fontWeight: 600 }}>
        <ArrowLeft size={20} /> Back to Wiki
      </Link>

      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: "3.5rem", fontFamily: "var(--font-display)", marginBottom: "10px", textAlign: "center" }} className="gradient-text">
        Gyms & Custom NPCs
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto 50px" }}>
        Challenge unique Gym Leaders spread across the map, interact with custom Quest NPCs, and trade with specialized merchants.
      </motion.p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
        <div style={{ flex: "1 1 500px" }}>
          <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-display)", marginBottom: "20px" }}>The Gym Challenge</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "20px", lineHeight: 1.6 }}>
            Gyms are scattered throughout the open world. You must find them and challenge their leaders in order to collect all the badges. Badges unlock new tiers in the shop and allow you to command higher-level Pokemon.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {gyms.map((gym, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel"
                style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontFamily: "var(--font-display)", marginBottom: "5px" }}>{gym.name}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Leader: {gym.leader}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "var(--accent-cyan)", fontWeight: 600, marginBottom: "5px" }}>{gym.badge}</div>
                  <div style={{ fontSize: "0.8rem", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "10px" }}>Lv {gym.level}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ flex: "1 1 500px" }}>
          <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-display)", marginBottom: "20px" }}>Special NPCs</h2>
          <div className="glass-panel" style={{ padding: "30px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)", marginBottom: "10px", color: "var(--accent-purple)" }}>The Move Tutor</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Located at the grand library, the Move Tutor will teach your Pokemon powerful signature moves in exchange for Heart Scales.</p>
          </div>
          <div className="glass-panel" style={{ padding: "30px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)", marginBottom: "10px", color: "var(--accent-emerald)" }}>Crate Merchant</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Found at spawn, this merchant will exchange your hard-earned Crate Keys from Raids and Dungeons for exclusive Cosmetic items.</p>
          </div>
          <div className="glass-panel" style={{ padding: "30px" }}>
            <h3 style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)", marginBottom: "10px", color: "#ffaa00" }}>Fusion Scientist</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Hidden deep within the tech lab, the scientist can help you merge compatible Pokemon using DNA Splicers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { use } from "react";
import Link from "next/link";
import fusionsData from "@/data/fusions.json";

export default function FusionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const mon = fusionsData.find((m: any) => m.id === unwrappedParams.id);

  if (!mon) {
    return (
      <div className="inner" style={{ padding: "100px 20px", textAlign: "center" }}>
        <h2>Fusion not found.</h2>
        <Link href="/wiki/fusions" style={{ color: "var(--ghost-accent-color)" }}>Return to Fusion Dex</Link>
      </div>
    );
  }

  const capitalize = (str: string) => str ? str.replace(/\b\w/g, l => l.toUpperCase()) : "";

  const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => {
    const percentage = Math.min((value / 255) * 100, 100);
    return (
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "0.9rem" }}>
          <span style={{ color: "gray", fontWeight: 600 }}>{label}</span>
          <span style={{ fontWeight: 800 }}>{value}</span>
        </div>
        <div style={{ width: "100%", height: "8px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", background: color, borderRadius: "4px", width: `${percentage}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="inner" style={{ padding: "60px 0", maxWidth: "1000px", margin: "0 auto" }}>
      <Link href="/wiki/fusions" style={{ color: "var(--ghost-accent-color)", fontWeight: "bold", display: "block", marginBottom: "30px" }}>
        &larr; Back to Fusion Dex
      </Link>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
        {/* Left Column */}
        <div style={{ flex: "1 1 350px" }}>
          <div className="fakemon-card" style={{ padding: "40px", position: "relative" }}>
            <div style={{ position: "absolute", top: "20px", left: "20px", fontSize: "1.2rem", fontWeight: 800, color: "gray" }}>
              Fusion
            </div>
            
            <div style={{ width: "200px", height: "200px", margin: "0 auto 30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <img 
                 src={mon.image || `/images/fakemons/${mon.name.replace(/ /g, '_')}.png`} 
                 alt={mon.name}
                 onError={(e) => { (e.target as HTMLImageElement).src = '/images/pokeball_placeholder.png'; }}
                 style={{ width: "100%", height: "100%", objectFit: "contain" }}
               />
            </div>
            
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "20px 0" }}>{capitalize(mon.name.replace(/_/g, " "))}</h1>
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {mon.primaryType && <span style={{ background: "#f0f0f0", padding: "6px 16px", borderRadius: "20px", fontWeight: 600, textTransform: "capitalize" }}>{mon.primaryType}</span>}
              {mon.secondaryType && <span style={{ background: "#f0f0f0", padding: "6px 16px", borderRadius: "20px", fontWeight: 600, textTransform: "capitalize" }}>{mon.secondaryType}</span>}
            </div>
          </div>

          {mon.abilities && mon.abilities.length > 0 && (
            <div className="fakemon-card" style={{ padding: "30px", marginTop: "30px", textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "15px" }}>Abilities</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {mon.abilities.map((ability: string, idx: number) => {
                  const isHidden = ability.startsWith("h:");
                  const cleanName = isHidden ? ability.replace("h:", "") : ability;
                  return (
                     <li key={idx} style={{ padding: "10px", background: "#f9f9f9", marginBottom: "10px", borderRadius: "8px", fontWeight: 600 }}>
                      <span style={{ textTransform: "capitalize" }}>{cleanName.replace(/_/g, " ")}</span>
                      {isHidden && <span style={{ fontSize: "0.8rem", color: "white", background: "var(--ghost-accent-color)", padding: "2px 8px", borderRadius: "10px", marginLeft: "10px" }}>Hidden</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ flex: "2 1 500px" }}>
          <div className="fakemon-card" style={{ padding: "40px", textAlign: "left" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "30px" }}>Base Stats</h2>
            {mon.baseStats ? (
              <div>
                <StatBar label="HP" value={mon.baseStats.hp} color="#ff5959" />
                <StatBar label="Attack" value={mon.baseStats.attack} color="#f5ac78" />
                <StatBar label="Defense" value={mon.baseStats.defence} color="#fae078" />
                <StatBar label="Sp. Atk" value={mon.baseStats.special_attack} color="#9db7f5" />
                <StatBar label="Sp. Def" value={mon.baseStats.special_defence} color="#a7db8d" />
                <StatBar label="Speed" value={mon.baseStats.speed} color="#fa92b2" />
                <div style={{ marginTop: "20px", textAlign: "right", fontWeight: 800, fontSize: "1.2rem", color: "gray" }}>
                  Total: {mon.baseStats.hp + mon.baseStats.attack + mon.baseStats.defence + mon.baseStats.special_attack + mon.baseStats.special_defence + mon.baseStats.speed}
                </div>
              </div>
            ) : (
              <p>Stats not provided.</p>
            )}
          </div>

          {mon.forms && mon.forms.length > 0 && (
            <div className="fakemon-card" style={{ padding: "40px", marginTop: "30px", textAlign: "left" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "20px" }}>Alternate Forms</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {mon.forms.map((form: any, idx: number) => (
                  <div key={idx} style={{ background: "#f9f9f9", padding: "15px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>{capitalize(form.name)}</span>
                    <div style={{ display: "flex", gap: "5px" }}>
                      {form.primaryType && <span style={{ fontSize: "0.8rem", background: "#e0e0e0", padding: "4px 8px", borderRadius: "8px" }}>{capitalize(form.primaryType)}</span>}
                      {form.secondaryType && <span style={{ fontSize: "0.8rem", background: "#e0e0e0", padding: "4px 8px", borderRadius: "8px" }}>{capitalize(form.secondaryType)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mon.moves && mon.moves.length > 0 && (
            <div className="fakemon-card" style={{ padding: "40px", marginTop: "30px", textAlign: "left" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "20px" }}>Learnable Moves</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                {mon.moves.map((move: string, idx: number) => {
                  let badgeColor = "#f0f0f0";
                  if (move.startsWith("tm:")) badgeColor = "#e6f7ff";
                  else if (move.startsWith("tutor:")) badgeColor = "#f9e6ff";
                  else if (move.startsWith("egg:")) badgeColor = "#fffbe6";
                  
                  return (
                    <div key={idx} style={{ background: badgeColor, padding: "8px 12px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 500, textAlign: "center" }}>
                      {move}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

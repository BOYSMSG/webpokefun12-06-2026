"use client";

import React from "react";
import Link from "next/link";

export default function VotePage() {
  const voteLinks = [
    { name: "Minecraft Best Servers", url: "https://minecraftbestservers.com/server-pokefun.4851/vote", icon: "fa-solid fa-check-to-slot" },
    { name: "Minecraft Servers Org", url: "https://minecraftservers.org/server/681278", icon: "fa-solid fa-star" },
    { name: "Minecraft Server List", url: "https://minecraft-serverlist.com/server/3783", icon: "fa-solid fa-list" },
    { name: "Minecraft Buzz", url: "https://minecraft.buzz/server/18041", icon: "fa-solid fa-bolt" },
    { name: "Minecraft MP", url: "https://minecraft-mp.com/server/351806/vote", icon: "fa-solid fa-trophy" },
  ];

  return (
    <div className="inner" style={{ padding: "80px 0", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "10px", fontWeight: 800 }}>
        Vote for Pokéfun
      </h1>
      <p style={{ textAlign: "center", color: "gray", fontSize: "1.2rem", marginBottom: "50px" }}>
        Support the server and earn epic rewards!
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
        
        {/* Left Side: Vote Links */}
        <div style={{ flex: "1 1 500px" }}>
          <div className="fakemon-card" style={{ padding: "40px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="fa-solid fa-link" style={{ color: "var(--ghost-accent-color)" }}></i> Voting Links
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {voteLinks.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "15px", 
                    padding: "15px 20px", 
                    background: "rgba(0,0,0,0.03)", 
                    borderRadius: "10px", 
                    textDecoration: "none", 
                    color: "inherit",
                    fontWeight: "bold",
                    transition: "transform 0.2s ease, background 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(5px)";
                    e.currentTarget.style.background = "rgba(0,0,0,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                  }}
                >
                  <div style={{ 
                    width: "40px", 
                    height: "40px", 
                    background: "var(--ghost-accent-color)", 
                    color: "white", 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: "1.2rem"
                  }}>
                    <i className={link.icon}></i>
                  </div>
                  <span style={{ fontSize: "1.1rem" }}>{link.name}</span>
                  <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: "auto", color: "gray" }}></i>
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* Right Side: Rewards */}
        <div style={{ flex: "1 1 350px" }}>
          <div className="fakemon-card" style={{ padding: "40px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="fa-solid fa-gift" style={{ color: "var(--ghost-accent-color)" }}></i> Rewards
            </h2>
            <p style={{ color: "gray", marginBottom: "20px" }}>By voting you receive the following rewards in-game:</p>
            
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "15px" }}>
              <li style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                <i className="fa-solid fa-key" style={{ color: "var(--ghost-accent-color)", fontSize: "1.2rem", marginTop: "4px" }}></i>
                <div>
                  <strong style={{ display: "block", fontSize: "1.1rem" }}>Vote Key</strong>
                  <span style={{ color: "gray", fontSize: "0.9rem" }}>Use at the spawn crate for random loot</span>
                </div>
              </li>
              <li style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                <i className="fa-solid fa-coins" style={{ color: "var(--ghost-accent-color)", fontSize: "1.2rem", marginTop: "4px" }}></i>
                <div>
                  <strong style={{ display: "block", fontSize: "1.1rem" }}>$500 Money</strong>
                  <span style={{ color: "gray", fontSize: "0.9rem" }}>In-game currency to spend</span>
                </div>
              </li>
              <li style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                <i className="fa-solid fa-arrow-up" style={{ color: "var(--ghost-accent-color)", fontSize: "1.2rem", marginTop: "4px" }}></i>
                <div>
                  <strong style={{ display: "block", fontSize: "1.1rem" }}>Bonus EXP</strong>
                  <span style={{ color: "gray", fontSize: "0.9rem" }}>Level up faster</span>
                </div>
              </li>
              <li style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                <i className="fa-solid fa-crown" style={{ color: "var(--ghost-accent-color)", fontSize: "1.2rem", marginTop: "4px" }}></i>
                <div>
                  <strong style={{ display: "block", fontSize: "1.1rem" }}>Monthly Top Voter</strong>
                  <span style={{ color: "gray", fontSize: "0.9rem" }}>Win epic prizes at the end of the month!</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

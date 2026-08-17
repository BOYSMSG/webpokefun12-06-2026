import React from "react";

export default function ChangelogsPage() {
  return (
    <div className="inner" style={{ padding: "80px 0", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "10px", fontWeight: 800 }}>
        Changelogs
      </h1>
      <p style={{ textAlign: "center", color: "gray", fontSize: "1.2rem", marginBottom: "50px" }}>
        Stay up to date with the latest server updates and patches.
      </p>

      <div style={{ padding: "40px", background: "rgba(30, 34, 39, 0.7)", borderRadius: "16px", border: "1px solid #333", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ghost-accent-color)", borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>
          Update v1.3.1 (Plot System & Bug Fixes) <span style={{ fontSize: "1rem", color: "gray", fontWeight: 400, marginLeft: "10px" }}>August 17, 2026</span>
        </h2>
        
        <div style={{ color: "#d1d5db", fontSize: "1.1rem", lineHeight: 1.6 }}>
          <p style={{ marginBottom: "15px" }}>Welcome to the <strong>Plots and Property</strong> update! We've improved and reorganized the plot system to fix bugs and create a better civilization experience.</p>
          
          <h3 style={{ fontSize: "1.4rem", color: "#fff", marginTop: "25px", marginBottom: "15px" }}>🌍 World Updates</h3>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}><strong>New Survival World</strong> added. Old homes were reset.</li>
            <li style={{ marginBottom: "8px" }}><strong>New City World</strong> with the updated plot system. (Don't worry, old plot worlds were not reset. If you need your home shifted, just inform us in chat!)</li>
            <li style={{ marginBottom: "8px" }}>Quick warp commands <code>/survival</code>, <code>/city</code>, and <code>/plot</code> added and working properly.</li>
          </ul>

          <h3 style={{ fontSize: "1.4rem", color: "#fff", marginTop: "25px", marginBottom: "15px" }}>🏠 Plot Features</h3>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>Everyone can now safely get and buy their own plots.</li>
            <li style={{ marginBottom: "8px" }}>The system is much better organized to prevent overlap and bugs.</li>
            <li style={{ marginBottom: "8px" }}>Default players can now claim up to <strong>3 plots</strong>!</li>
            <li style={{ marginBottom: "8px" }}>Rank holders can claim up to <strong>20 plots</strong>!</li>
          </ul>

          <h3 style={{ fontSize: "1.4rem", color: "#fff", marginTop: "25px", marginBottom: "15px" }}>🌌 Legendary Vault System</h3>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>Introduced a completely new way to encounter powerful Pokémon!</li>
            <li style={{ marginBottom: "8px" }}>Summon legendaries through Rituals, Shrines, Temples, Laboratories & Special Machines.</li>
            <li style={{ marginBottom: "8px" }}>Features custom mechanics like Mewtwo Cloning and the Arceus Ultimate Ritual.</li>
          </ul>

          <p style={{ marginTop: "30px", fontStyle: "italic", color: "#9ca3af" }}>
            Check out the <a href="/wiki/guides/plots" style={{ color: "var(--ghost-accent-color)", textDecoration: "underline" }}>Plots & Property Wiki</a> and the <a href="/wiki/guides/legendaries" style={{ color: "var(--ghost-accent-color)", textDecoration: "underline" }}>Legendary System Wiki</a> for a full list of commands and details!
          </p>
        </div>
      </div>
    </div>
  );
}

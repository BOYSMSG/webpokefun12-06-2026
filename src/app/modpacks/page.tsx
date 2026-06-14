import React from "react";
import Link from "next/link";

export default function ModpacksPage() {
  return (
    <div className="inner" style={{ padding: "80px 0", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "10px", fontWeight: 800 }}>
        Pokefun Modpacks
      </h1>
      <p style={{ textAlign: "center", color: "gray", fontSize: "1.2rem", marginBottom: "50px" }}>
        Choose your platform and start your adventure!
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginBottom: "80px" }}>
        {/* PC CurseForge */}
        <div className="fakemon-card" style={{ padding: "40px 20px", textAlign: "center" }}>
          <i className="fa-solid fa-desktop" style={{ fontSize: "3rem", color: "var(--ghost-accent-color)", marginBottom: "20px" }}></i>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>PC Players</h2>
          <p style={{ color: "gray", marginBottom: "30px" }}>Standard CurseForge Modpack for the best experience.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <a href="https://www.curseforge.com/minecraft/modpacks/pokefun-cobblemon" target="_blank" rel="noreferrer" style={{ background: "var(--ghost-accent-color)", color: "white", padding: "10px 20px", borderRadius: "30px", textDecoration: "none", fontWeight: "bold", width: "100%", maxWidth: "250px" }}>
              <i className="fa-solid fa-download"></i> CurseForge Modpack
            </a>
            <a href="https://modrinth.com/modpack/pokefun/versions" target="_blank" rel="noreferrer" style={{ border: "2px solid var(--ghost-accent-color)", color: "var(--ghost-accent-color)", padding: "10px 20px", borderRadius: "30px", textDecoration: "none", fontWeight: "bold", width: "100%", maxWidth: "250px" }}>
              <i className="fa-solid fa-link"></i> Modrinth Versions
            </a>
          </div>
        </div>

        {/* Advanced Links */}
        <div className="fakemon-card" style={{ padding: "40px 20px", textAlign: "center" }}>
          <i className="fa-solid fa-bolt" style={{ fontSize: "3rem", color: "var(--ghost-accent-color)", marginBottom: "20px" }}></i>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Advanced Links</h2>
          <p style={{ color: "gray", marginBottom: "30px" }}>Modrinth and other advanced modpack versions.</p>
          <a href="https://store.pokefun.in/modpacks" target="_blank" rel="noreferrer" style={{ border: "2px solid var(--ghost-accent-color)", color: "var(--ghost-accent-color)", padding: "10px 20px", borderRadius: "30px", textDecoration: "none", fontWeight: "bold", display: "inline-block", width: "100%", maxWidth: "250px" }}>
            <i className="fa-solid fa-link"></i> Advanced Links
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="fakemon-card" style={{ padding: "40px 20px", textAlign: "center" }}>
          <i className="fa-solid fa-mobile-screen" style={{ fontSize: "3rem", color: "var(--ghost-accent-color)", marginBottom: "20px" }}></i>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Mobile Players</h2>
          <p style={{ color: "gray", marginBottom: "30px" }}>Special controls and setup for mobile devices.</p>
          <a href="https://drive.google.com/file/d/1cKrdzKCoLeH9vbzwehHf5sO0JpxGCBi6/view?usp=sharing" target="_blank" rel="noreferrer" style={{ background: "var(--ghost-accent-color)", color: "white", padding: "10px 20px", borderRadius: "30px", textDecoration: "none", fontWeight: "bold", display: "inline-block", width: "100%", maxWidth: "250px" }}>
            <i className="fa-solid fa-gamepad"></i> Mobile Controls
          </a>
        </div>
      </div>

      <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "30px", fontWeight: 800 }}>Installation Guides</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginBottom: "80px" }}>
        
        {/* Mobile Guide */}
        <div className="fakemon-card" style={{ padding: "0", overflow: "hidden", borderRadius: "12px", position: "relative" }}>
          <img src="/images/mobileguide.png" alt="Mobile Guide" style={{ width: "100%", height: "auto", display: "block" }} />
          <a href="https://youtu.be/cti3gLQTT1M" target="_blank" rel="noreferrer" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", textDecoration: "none" }}>
            <i className="fa-solid fa-play" style={{ fontSize: "4rem", color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}></i>
          </a>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>How to Play on Mobile</h3>
            <p style={{ color: "gray" }}>Step by step installation guide for Android users.</p>
          </div>
        </div>

        {/* PC Guide */}
        <div className="fakemon-card" style={{ padding: "0", overflow: "hidden", borderRadius: "12px", position: "relative" }}>
          <img src="/images/pcguide.png" alt="PC Guide" style={{ width: "100%", height: "auto", display: "block" }} />
          <a href="https://youtu.be/eTZY2fRo8Wc" target="_blank" rel="noreferrer" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", textDecoration: "none" }}>
            <i className="fa-solid fa-play" style={{ fontSize: "4rem", color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}></i>
          </a>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>How to Play on PC</h3>
            <p style={{ color: "gray" }}>Step by step installation guide for PC players.</p>
          </div>
        </div>

      </div>

    </div>
  );
}

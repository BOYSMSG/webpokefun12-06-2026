"use client";

import Link from "next/link";
import MainNavbar from "@/components/MainNavbar";
import { useEffect, useState } from "react";

export default function WikiHome() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <MainNavbar />
      <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <div className="inner" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#111827", textAlign: "center", marginBottom: "20px" }}>
            The Pokémon Database Hub
          </h1>
          <p style={{ textAlign: "center", color: "gray", fontSize: "1.2rem", marginBottom: "50px", maxWidth: "800px", margin: "0 auto 50px" }}>
            Explore every detail of the Pokémon universe. From Pokédex data and movesets to items, berries, and game locations.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
            
            {/* Pokedex Card */}
            <Link href="/wiki/pokedex" style={{ textDecoration: "none" }}>
              <div style={{ background: "white", padding: "40px 30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center", transition: "transform 0.3s, boxShadow 0.3s", cursor: "pointer", height: '100%' }}
                   onMouseOver={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(239, 68, 68, 0.2)"; }}
                   onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)"; }}>
                <div style={{ background: "#fee2e2", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", color: "#ef4444" }}>
                  <i className="fa-solid fa-tablet-screen-button"></i>
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px", color: "#111827" }}>National Pokédex</h2>
                <p style={{ color: "gray" }}>Explore all Pokémon, their stats, types, abilities, and learnable moves.</p>
              </div>
            </Link>

            {/* Moves Card */}
            <Link href="/wiki/moves" style={{ textDecoration: "none" }}>
              <div style={{ background: "white", padding: "40px 30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center", transition: "transform 0.3s, boxShadow 0.3s", cursor: "pointer", height: '100%' }}
                   onMouseOver={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(59, 130, 246, 0.2)"; }}
                   onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)"; }}>
                <div style={{ background: "#dbeafe", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", color: "#3b82f6" }}>
                  <i className="fa-solid fa-fire"></i>
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px", color: "#111827" }}>Moves Database</h2>
                <p style={{ color: "gray" }}>Search for all Pokémon moves, their power, accuracy, and effects.</p>
              </div>
            </Link>

            {/* Items Card */}
            <Link href="/wiki/items" style={{ textDecoration: "none" }}>
              <div style={{ background: "white", padding: "40px 30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center", transition: "transform 0.3s, boxShadow 0.3s", cursor: "pointer", height: '100%' }}
                   onMouseOver={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(16, 185, 129, 0.2)"; }}
                   onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)"; }}>
                <div style={{ background: "#d1fae5", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", color: "#10b981" }}>
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px", color: "#111827" }}>Items & Berries</h2>
                <p style={{ color: "gray" }}>A complete list of items, TMs, HMs, and berries with their attributes.</p>
              </div>
            </Link>

            {/* Locations Card */}
            <Link href="/wiki/locations" style={{ textDecoration: "none" }}>
              <div style={{ background: "white", padding: "40px 30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center", transition: "transform 0.3s, boxShadow 0.3s", cursor: "pointer", height: '100%' }}
                   onMouseOver={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(245, 158, 11, 0.2)"; }}
                   onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)"; }}>
                <div style={{ background: "#fef3c7", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", color: "#f59e0b" }}>
                  <i className="fa-solid fa-map-location-dot"></i>
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px", color: "#111827" }}>Regions & Locations</h2>
                <p style={{ color: "gray" }}>Discover regions, cities, and the Pokémon encounters available there.</p>
              </div>
            </Link>

            {/* Games Card */}
            <Link href="/wiki/games" style={{ textDecoration: "none" }}>
              <div style={{ background: "white", padding: "40px 30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center", transition: "transform 0.3s, boxShadow 0.3s", cursor: "pointer", height: '100%' }}
                   onMouseOver={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(139, 92, 246, 0.2)"; }}
                   onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)"; }}>
                <div style={{ background: "#ede9fe", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", color: "#8b5cf6" }}>
                  <i className="fa-solid fa-gamepad"></i>
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px", color: "#111827" }}>Games & Generations</h2>
                <p style={{ color: "gray" }}>Explore all Pokémon game versions and generations.</p>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}

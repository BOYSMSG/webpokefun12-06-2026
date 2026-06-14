"use client";

import React, { useState } from "react";
import Link from "next/link";

const wikiPages = [
  { href: "/wiki/guides/npc", icon: "🗺️", title: "NPCs & Gyms Guide", desc: "Complete guide to Gyms, custom NPCs, EV Training, and Server Warps.", bg: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
  { href: "/wiki/pokedex", icon: "📖", title: "Official Pokémon Dex", desc: "Explore all official Pokémon, their base stats, abilities, typings, and more!", bg: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  { href: "/wiki/fakemons", icon: "🐉", title: "Fakemon Dex", desc: "Explore all the custom Fakemons, their stats, types, abilities, and learnable moves.", bg: "#e6f7ff" },
  { href: "/wiki/cosmetics", icon: "✨", title: "Cosmetics", desc: "Check out the huge gallery of custom Pokemon skins and costumes you can earn.", bg: "#f9e6ff" },
  { href: "/wiki/fusions", icon: "🧬", title: "Fusion Dex", desc: "Discover all the custom Fusions! View their exclusive typings, stats, and abilities.", bg: "#e6e6ff" },
  { href: "/showcase", icon: "📸", title: "Media Showcase", desc: "View all server images, Feature screenshots, Fakemons, and Cosmetics!", bg: "#fffbe6" },
  { href: "/wiki/guides/dungeon", icon: "🏰", title: "Dungeons", desc: "Complete details on Dungeon instances, loot, and mechanics.", bg: "#e6ffe6" },
  { href: "/wiki/guides/raid", icon: "⚔️", title: "Raids", desc: "Learn about the raid battles, bosses, and rare rewards.", bg: "#ffe6e6" },
  { href: "/wiki/guides/alphazone", icon: "🌌", title: "Alpha Zone", desc: "Details about the challenging Alpha Zone and its exclusive Pokemon.", bg: "#e6e6ff" },
  { href: "/wiki/guides/ranked", icon: "🏆", title: "Ranked PvP", desc: "Information on competitive battles, ladders, and rewards.", bg: "#fffbe6" },
  { href: "/wiki/guides/cobblebosses", icon: "👹", title: "Bosses", desc: "Learn how to defeat the powerful Cobblemon Bosses.", bg: "#f9e6ff" },
];

export default function WikiIndex() {
  const [search, setSearch] = useState("");

  const filteredPages = wikiPages.filter(page => 
    page.title.toLowerCase().includes(search.toLowerCase()) || 
    page.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inner" style={{ paddingTop: "80px", paddingBottom: "60px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ color: "white", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "3.5rem", textAlign: "center", marginBottom: "10px", fontWeight: 800 }}>Pokefun Wiki</h1>
        <p style={{ textAlign: "center", color: "white", fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto", marginBottom: "30px" }}>
          Your ultimate guide to everything on the Pokefun server. Discover custom Pokemon, unique cosmetics, and all the special features!
        </p>
        
        {/* Search Bar */}
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
          <input 
            type="text" 
            placeholder="Search guides, wikis, pokedex..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "15px 20px 15px 50px",
              fontSize: "1.2rem",
              borderRadius: "50px",
              border: "none",
              outline: "none",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}
          />
          <span style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem", color: "#aaa" }}>
            🔍
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", paddingBottom: "50px" }}>
        {filteredPages.length > 0 ? (
          filteredPages.map((page, idx) => (
            <Link key={idx} href={page.href} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="fakemon-card" style={{ padding: "40px 20px", height: "100%" }}>
                <div style={{ background: page.bg, width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", color: page.bg.includes('gradient') ? 'white' : 'inherit' }}>
                  {page.icon}
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>{page.title}</h2>
                <p style={{ color: "gray" }}>{page.desc}</p>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px", color: "white", fontSize: "1.5rem" }}>
            No results found for "{search}"
          </div>
        )}
      </div>
    </div>
  );
}

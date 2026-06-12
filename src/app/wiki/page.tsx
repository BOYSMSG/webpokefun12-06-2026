"use client";

import React from "react";
import Link from "next/link";

export default function WikiIndex() {
  return (
    <div className="inner" style={{ paddingTop: "80px", paddingBottom: "60px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ color: "white", marginBottom: "80px" }}>
        <h1 style={{ fontSize: "3.5rem", textAlign: "center", marginBottom: "10px", fontWeight: 800 }}>Pokefun Wiki</h1>
        <p style={{ textAlign: "center", color: "white", fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto" }}>
          Your ultimate guide to everything on the Pokefun server. Discover custom Pokemon, unique cosmetics, and all the special features!
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", paddingBottom: "50px" }}>
        
        <Link href="/wiki/guides/npc" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", color: "white" }}>
              🗺️
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>NPCs & Gyms Guide</h2>
            <p style={{ color: "gray" }}>Complete guide to Gyms, custom NPCs, EV Training, and Server Warps.</p>
          </div>
        </Link>

        <Link href="/wiki/pokedex" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", color: "white" }}>
              📖
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Official Pokémon Dex</h2>
            <p style={{ color: "gray" }}>Explore all official Pokémon, their base stats, abilities, typings, and more!</p>
          </div>
        </Link>

        <Link href="/wiki/fakemons" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "#e6f7ff", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>
              🐉
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Fakemon Dex</h2>
            <p style={{ color: "gray" }}>Explore all the custom Fakemons, their stats, types, abilities, and learnable moves.</p>
          </div>
        </Link>

        <Link href="/wiki/cosmetics" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "#f9e6ff", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>
              ✨
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Cosmetics</h2>
            <p style={{ color: "gray" }}>Check out the huge gallery of custom Pokemon skins and costumes you can earn.</p>
          </div>
        </Link>

        <Link href="/wiki/fusions" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "#e6e6ff", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>
              🧬
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Fusion Dex</h2>
            <p style={{ color: "gray" }}>Discover all the custom Fusions! View their exclusive typings, stats, and abilities.</p>
          </div>
        </Link>

        <Link href="/showcase" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "#fffbe6", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>
              📸
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Media Showcase</h2>
            <p style={{ color: "gray" }}>View all server images, Feature screenshots, Fakemons, and Cosmetics!</p>
          </div>
        </Link>

        <Link href="/wiki/guides/dungeon" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "#e6ffe6", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>
              🏰
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Dungeons</h2>
            <p style={{ color: "gray" }}>Complete details on Dungeon instances, loot, and mechanics.</p>
          </div>
        </Link>

        <Link href="/wiki/guides/raid" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "#ffe6e6", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>
              ⚔️
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Raids</h2>
            <p style={{ color: "gray" }}>Learn about the raid battles, bosses, and rare rewards.</p>
          </div>
        </Link>

        <Link href="/wiki/guides/alphazone" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "#e6e6ff", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>
              🌌
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Alpha Zone</h2>
            <p style={{ color: "gray" }}>Details about the challenging Alpha Zone and its exclusive Pokemon.</p>
          </div>
        </Link>

        <Link href="/wiki/guides/ranked" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "#fffbe6", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>
              🏆
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Ranked PvP</h2>
            <p style={{ color: "gray" }}>Information on competitive battles, ladders, and rewards.</p>
          </div>
        </Link>

        <Link href="/wiki/guides/cobblebosses" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="fakemon-card" style={{ padding: "40px 20px" }}>
            <div style={{ background: "#f9e6ff", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>
              👹
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "10px" }}>Bosses</h2>
            <p style={{ color: "gray" }}>Learn how to defeat the powerful Cobblemon Bosses.</p>
          </div>
        </Link>


      </div>
    </div>
  );
}

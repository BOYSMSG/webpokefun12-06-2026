"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import fakemonsData from "@/data/fakemons.json";
import showcaseData from "@/data/fakemon_showcase.json";

export default function FakemonsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMons, setFilteredMons] = useState(fakemonsData);

  const [visibleCount, setVisibleCount] = useState(40);

  useEffect(() => {
    setFilteredMons(
      fakemonsData.filter(mon => 
        mon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setVisibleCount(40);
  }, [searchTerm]);

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFakemonImage = (fakemonName: string, id: string) => {
    const match = showcaseData.find(s => s.name.toLowerCase().includes(fakemonName.toLowerCase()));
    return match ? match.image : `/images/fakemons/${id}.png`;
  };

  const displayedMons = filteredMons.slice(0, visibleCount);

  return (
    <div className="inner" style={{ padding: "60px 0", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/wiki" style={{ color: "var(--ghost-accent-color)", fontWeight: "bold" }}>
          &larr; Back to Wiki
        </Link>
      </div>

      <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "10px", fontWeight: 800 }}>Fakemon Dex</h1>
      <p style={{ textAlign: "center", color: "gray", fontSize: "1.2rem", marginBottom: "40px" }}>
        Discover {fakemonsData.length} unique Fakemons found across Pokefun.
      </p>

      <div style={{ maxWidth: "600px", margin: "0 auto 50px" }}>
        <input 
          type="text" 
          placeholder="Search Fakemons..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "15px 20px",
            borderRadius: "30px",
            border: "1px solid #ccc",
            fontSize: "1.1rem",
            outline: "none",
          }}
        />
      </div>

      <div className="fakemons-grid">
        {displayedMons.map((mon, idx) => (
          <Link href={`/wiki/fakemons/${mon.id}`} key={mon.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="fakemon-card">
              <div style={{ fontSize: "0.9rem", color: "gray", fontWeight: 600, textAlign: "left", marginBottom: "10px" }}>
                {mon.nationalPokedexNumber ? `#${mon.nationalPokedexNumber}` : "Custom"}
              </div>
              <img 
                src={mon.image} 
                alt={mon.name}
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="fakemon-img"
              />
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "10px 0" }}>{capitalize(mon.name)}</h3>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                {mon.primaryType && (
                  <span style={{ background: "#f0f0f0", padding: "4px 12px", borderRadius: "12px", fontSize: "0.85rem", textTransform: "capitalize" }}>
                    {mon.primaryType}
                  </span>
                )}
                {mon.secondaryType && (
                  <span style={{ background: "#f0f0f0", padding: "4px 12px", borderRadius: "12px", fontSize: "0.85rem", textTransform: "capitalize" }}>
                    {mon.secondaryType}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < filteredMons.length && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button 
            onClick={() => setVisibleCount(prev => prev + 40)}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "14px 35px",
              borderRadius: "30px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
            }}
          >
            Load More ({filteredMons.length - visibleCount} remaining)
          </button>
        </div>
      )}
      
      {filteredMons.length === 0 && (
        <div style={{ textAlign: "center", color: "gray", marginTop: "50px" }}>
          No Fakemons found matching "{searchTerm}".
        </div>
      )}
    </div>
  );
}

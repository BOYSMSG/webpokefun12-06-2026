"use client";

import React from "react";
import Link from "next/link";
import cosmeticsData from "@/data/cosmetics.json";

export default function CosmeticsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [visibleCount, setVisibleCount] = React.useState(36);

  const filteredCosmetics = React.useMemo(() => {
    if (!searchTerm) return cosmeticsData;
    return cosmeticsData.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const visibleList = filteredCosmetics.slice(0, visibleCount);

  return (
    <div className="inner" style={{ padding: "60px 0", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/wiki" style={{ color: "var(--ghost-accent-color)", fontWeight: "bold" }}>
          &larr; Back to Wiki
        </Link>
      </div>

      <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "10px", fontWeight: 800 }}>Cosmetics Gallery</h1>
      <p style={{ textAlign: "center", color: "gray", fontSize: "1.2rem", marginBottom: "30px", maxWidth: "800px", margin: "0 auto 30px" }}>
        Stand out from the crowd with custom textures and costumes! ({filteredCosmetics.length} Total)
      </p>

      <div style={{ maxWidth: "500px", margin: "0 auto 40px" }}>
        <input 
          type="text" 
          placeholder="Search cosmetics..." 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(36);
          }}
          style={{
            width: "100%",
            padding: "12px 20px",
            borderRadius: "30px",
            border: "1px solid #444",
            background: "#1f2937",
            color: "white",
            fontSize: "1rem",
            outline: "none",
          }}
        />
      </div>

      <div className="fakemons-grid">
        {visibleList.map((skin, idx) => (
          <div key={idx} className="fakemon-card">
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}>
               <img 
                 src={skin.image} 
                 alt={skin.name} 
                 loading="lazy"
                 decoding="async"
                 style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                 onError={(e) => { e.currentTarget.style.display = 'none'; }}
               />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, textTransform: "capitalize" }}>{skin.name}</h3>
            <p style={{ color: "gray", fontSize: "0.9rem", marginTop: "5px" }}>Cosmetic Skin</p>
          </div>
        ))}
      </div>

      {visibleCount < filteredCosmetics.length && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button 
            onClick={() => setVisibleCount(prev => prev + 36)}
            style={{
              background: "#10b981",
              color: "white",
              border: "none",
              padding: "14px 35px",
              borderRadius: "30px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
            }}
          >
            Load More ({filteredCosmetics.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

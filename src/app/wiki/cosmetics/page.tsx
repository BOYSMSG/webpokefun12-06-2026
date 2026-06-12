"use client";

import React from "react";
import Link from "next/link";
import cosmeticsData from "@/data/cosmetics.json";

export default function CosmeticsPage() {
  return (
    <div className="inner" style={{ padding: "60px 0", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/wiki" style={{ color: "var(--ghost-accent-color)", fontWeight: "bold" }}>
          &larr; Back to Wiki
        </Link>
      </div>

      <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "10px", fontWeight: 800 }}>Cosmetics Gallery</h1>
      <p style={{ textAlign: "center", color: "gray", fontSize: "1.2rem", marginBottom: "40px", maxWidth: "800px", margin: "0 auto 40px" }}>
        Stand out from the crowd with custom textures and costumes!
      </p>

      <div className="fakemons-grid">
        {cosmeticsData.map((skin, idx) => (
          <div key={idx} className="fakemon-card">
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}>
               <img 
                 src={skin.image} 
                 alt={skin.name} 
                 style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                 onError={(e) => { e.currentTarget.style.display = 'none'; }}
               />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, textTransform: "capitalize" }}>{skin.name}</h3>
            <p style={{ color: "gray", fontSize: "0.9rem", marginTop: "5px" }}>Cosmetic Skin</p>
          </div>
        ))}
      </div>
    </div>
  );
}

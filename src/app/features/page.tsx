"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "Raid Dens & Team Battles",
      desc: "Join forces with other trainers to take down massive Raid Bosses. Earn Crate Keys, rare candies, and exclusive drops.",
      image: "/images/features/image27_Team_Raids_Battle.png",
    },
    {
      title: "Alphazone",
      desc: "A dangerous, high-level zone where Alpha Pokemon roam. High risk, but extremely high reward.",
      image: "/images/features/cool spawn-2.png",
    },
    {
      title: "Dungeons",
      desc: "Explore procedurally generated dungeons filled with traps, puzzles, and powerful Boss Pokemon guarding epic loot.",
      image: "/images/features/minigamstasks-.png",
    },
    {
      title: "Ranked Matches",
      desc: "Climb the competitive ladder in our Ranked Matchmaking system. Prove you are the very best and earn seasonal rewards.",
      image: "/images/features/teambattles.png",
    },
    {
      title: "Mega Evolution & Primal Forms",
      desc: "Unleash the full potential of your Pokemon. We fully support Mega Evolutions, G-Max, and exclusive Primal Forms.",
      image: "/images/features/megapokemons-1.png",
    },
    {
      title: "Cosmetic Skins",
      desc: "Stand out with hundreds of custom cosmetic skins for your Pokemon. Obtainable completely free via gameplay and Crate Keys.",
      image: "/images/features/cosmetic skins1.png",
    }
  ];

  return (
    <div style={{ padding: "100px 20px 60px", maxWidth: "1200px", margin: "0 auto" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "var(--accent-cyan)", marginBottom: "30px", fontWeight: 600 }}>
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: "3.5rem", fontFamily: "var(--font-display)", marginBottom: "20px", textAlign: "center" }} className="gradient-text">
        Server Features
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto 60px" }}>
        Discover the unique mechanics, minigames, and systems that make Pokefun the ultimate Cobblemon destination.
      </motion.p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px" }}>
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel"
            style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            <div style={{ height: "200px", width: "100%", overflow: "hidden" }}>
              <img src={feature.image} alt={feature.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} className="feature-img" />
            </div>
            <div style={{ padding: "30px" }}>
              <h3 style={{ fontSize: "1.5rem", fontFamily: "var(--font-display)", marginBottom: "15px", color: "var(--text-primary)" }}>{feature.title}</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .glass-panel:hover .feature-img {
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
}

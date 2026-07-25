"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function RewardsDashboard() {
  const { data: session } = useSession();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real scenario, we would fetch the user's points from an API here
    if (session?.user) {
      fetch("/api/users/profile?email=" + encodeURIComponent(session.user.email || ""))
        .then(res => res.json())
        .then(data => {
          if (data && data.user) {
            setPoints(data.user.rewardPoints || 0);
          }
        });
    }
  }, [session]);

  const handleDailyCheckIn = async () => {
    if (!session?.user) return alert("Please login first!");
    setLoading(true);
    try {
      const res = await fetch("/api/rewards/daily-checkin", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setPoints(data.newPoints);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Failed to claim daily bonus.");
    }
    setLoading(false);
  };

  const cards = [
    { title: "Earn Rewards", desc: "Complete surveys & offers", icon: "fa-solid fa-coins", link: "/rewards/earn", color: "#f59e0b" }, // Orange
    { title: "Reward Shop", desc: "Buy exclusive items", icon: "fa-solid fa-store", link: "/rewards/shop", color: "#ef4444" }, // Red
    { title: "Limited Items", desc: "Exclusive Pokemon & Ranks", icon: "fa-solid fa-fire", link: "/rewards/shop?category=Limited", color: "#8b5cf6" }, // Purple
    { title: "History", desc: "View your transactions", icon: "fa-solid fa-clock-rotate-left", link: "/rewards/history", color: "#10b981" }, // Green
    { title: "Guide", desc: "How to earn points", icon: "fa-solid fa-book-open", link: "/rewards/guide", color: "#3b82f6" }, // Blue
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto", position: "relative" }}>
        
        {/* Top Header with Points */}
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "15px",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <h1 style={{ margin: 0, color: "white", fontSize: "2rem", fontWeight: "bold" }}>Pokefun Rewards</h1>
            <p style={{ margin: 0, color: "#94a3b8", marginTop: "5px" }}>Earn points and unlock exclusive rewards!</p>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button 
              onClick={handleDailyCheckIn}
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                padding: "10px 20px",
                borderRadius: "50px",
                border: "none",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: loading ? 0.7 : 1
              }}
            >
              <i className="fa-solid fa-calendar-check"></i> 
              {loading ? "Claiming..." : "Daily Check-in (+50)"}
            </button>

            <div style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              padding: "10px 25px",
              borderRadius: "50px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)"
            }}>
              <i className="fa-solid fa-gem" style={{ color: "white", fontSize: "1.2rem" }}></i>
              <span style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>{points} Points</span>
            </div>
          </div>
        </div>

        {/* Navigation Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "2rem"
        }}>
          {cards.map((card, idx) => {
            return (
              <Link href={card.link} key={idx} style={{ textDecoration: "none" }}>
                <div style={{
                  background: card.color,
                  borderRadius: "15px",
                  padding: "40px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: `0 10px 25px ${card.color}40`,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = `0 15px 35px ${card.color}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 10px 25px ${card.color}40`;
                }}
                >
                  <i className={card.icon} style={{ fontSize: "3rem", color: "white", marginBottom: "15px" }}></i>
                  <h2 style={{ margin: 0, color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>{card.title}</h2>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", marginTop: "5px" }}>{card.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

      </main>
    </div>
  );
}

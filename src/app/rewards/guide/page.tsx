"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function RewardGuidePage() {
  const { data: session } = useSession();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/users/profile?email=" + encodeURIComponent(session.user.email || ""))
        .then(res => res.json())
        .then(data => {
          if (data && data.user) setPoints(data.user.rewardPoints || 0);
        });
    }
  }, [session]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        
        {/* Header */}
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "15px",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <div>
            <h1 style={{ margin: 0, color: "white", fontSize: "2rem", fontWeight: "bold" }}>Rewards Guide</h1>
            <p style={{ margin: 0, color: "#94a3b8", marginTop: "5px" }}>Learn how to earn and spend your points!</p>
          </div>
          
          <div style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            padding: "10px 25px",
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <i className="fa-solid fa-gem" style={{ color: "white", fontSize: "1.2rem" }}></i>
            <span style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>{points} Points</span>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", padding: "30px", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)", color: "white", lineHeight: "1.6" }}>
          <h2 style={{ color: "#f59e0b" }}>1. How to Earn Points?</h2>
          <p>You can earn Reward Points completely for free by visiting the <strong>Earn Rewards</strong> page. We use the BitLabs Offerwall, which pays you points for completing simple tasks such as:</p>
          <ul>
            <li>Answering short surveys</li>
            <li>Playing specific mobile games</li>
            <li>Signing up for services</li>
          </ul>

          <h2 style={{ color: "#1cc6db", marginTop: "30px" }}>2. How to Spend Points?</h2>
          <p>Once you have enough points, head over to the <strong>Reward Shop</strong>! There you can buy exclusive Pokemon, ranks, crate keys, titles, and much more.</p>
          <p>When you purchase an item, it is instantly queued for delivery to the Minecraft server. Make sure your Minecraft account is linked in your <strong>Profile</strong>.</p>

          <h2 style={{ color: "#ef4444", marginTop: "30px" }}>3. Delivery Issues?</h2>
          <p>If you bought an item but didn't receive it in-game, please wait up to 60 seconds. Our server syncs deliveries asynchronously to prevent lag. If you still don't get it, open a ticket on our Discord server and a staff member will assist you.</p>
        </div>

      </main>
    </div>
  );
}

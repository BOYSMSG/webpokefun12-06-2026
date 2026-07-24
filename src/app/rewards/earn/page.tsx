"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function EarnRewardsPage() {
  const { data: session } = useSession();
  const [points, setPoints] = useState(0);

  useEffect(() => {
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

  const BITLABS_TOKEN = "bc32fb3b-8e89-4f86-9c68-dd1133149a2a";
  const userUid = session?.user?.email || "guest"; // We use email as UID since it's unique

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
            <h1 style={{ margin: 0, color: "white", fontSize: "2rem", fontWeight: "bold" }}>Earn Rewards</h1>
            <p style={{ margin: 0, color: "#94a3b8", marginTop: "5px" }}>Complete surveys and offers to earn points instantly!</p>
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

        {/* BitLabs Offerwall Container */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "15px",
          overflow: "hidden",
          height: "800px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}>
          {session ? (
            <iframe 
              src={`https://web.bitlabs.ai/?uid=${encodeURIComponent(userUid)}&token=${BITLABS_TOKEN}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="BitLabs Offerwall"
            ></iframe>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <i className="fa-solid fa-lock" style={{ fontSize: "4rem", color: "#64748b", marginBottom: "20px" }}></i>
              <h2 style={{ color: "white" }}>Please Login to Earn Rewards</h2>
              <p style={{ color: "#94a3b8" }}>You need to be logged in to access the offerwall.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function WelcomeLoginModal() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Only show the modal if the user is fully unauthenticated
    // and hasn't previously dismissed it in this browser.
    if (status === "unauthenticated") {
      const hasDismissed = localStorage.getItem("dismissedLoginModal");
      if (!hasDismissed) {
        // Show after a short delay for better UX
        const timer = setTimeout(() => setShowModal(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [status]);

  const handleDismiss = () => {
    localStorage.setItem("dismissedLoginModal", "true");
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(5px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999999
    }}>
      <div style={{
        background: "linear-gradient(to bottom right, #1f2937, #111827)",
        padding: "40px",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        textAlign: "center",
        maxWidth: "450px",
        width: "90%",
        animation: "scaleIn 0.3s ease-out"
      }}>
        
        <i className="fa-solid fa-gamepad" style={{ fontSize: "4rem", color: "#10b981", marginBottom: "20px" }}></i>
        
        <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "white", margin: "0 0 10px 0" }}>Welcome to Pokefun!</h2>
        <p style={{ color: "gray", fontSize: "1.1rem", marginBottom: "30px" }}>
          Join the community to post reels, like videos, and access the Creator Studio!
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
          <button onClick={() => signIn('discord')} style={{
            background: "#5865F2", color: "white", padding: "15px", borderRadius: "12px",
            fontSize: "1.1rem", fontWeight: "bold", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            transition: "0.2s"
          }} onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.2)"} onMouseOut={(e) => e.currentTarget.style.filter = "brightness(1)"}>
            <i className="fa-brands fa-discord"></i> Create Account / Login (Discord)
          </button>
          
          <button onClick={() => signIn('google')} style={{
            background: "#db4437", color: "white", padding: "15px", borderRadius: "12px",
            fontSize: "1.1rem", fontWeight: "bold", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            transition: "0.2s"
          }} onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.2)"} onMouseOut={(e) => e.currentTarget.style.filter = "brightness(1)"}>
            <i className="fa-brands fa-google"></i> Create Account / Login (Gmail)
          </button>
        </div>

        <button onClick={handleDismiss} style={{
          background: "transparent", color: "#8b5cf6", border: "none", textDecoration: "underline",
          cursor: "pointer", fontSize: "2.5rem", fontWeight: "bold", marginTop: "10px"
        }} onMouseOver={(e) => e.currentTarget.style.color = "white"} onMouseOut={(e) => e.currentTarget.style.color = "#8b5cf6"}>
          Continue without logging in
        </button>

      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

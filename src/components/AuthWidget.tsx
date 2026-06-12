"use client";

import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthWidget() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div style={{
        position: "fixed",
        top: "20px",
        right: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "15px",
        zIndex: 9999
      }}>
        {/* Main Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: session ? "linear-gradient(135deg, #8b5cf6, #3b82f6)" : "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            padding: "12px 25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
            transition: "transform 0.2s"
          }}
          title={session ? "Account Menu" : "Login / Sign Up"}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {session ? (
            <>
              <img src={session.user?.image || "/images/default-avatar.png"} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} />
              {session.user?.name}
            </>
          ) : (
            <>
              <i className="fa-solid fa-user-circle" style={{ fontSize: "1.5rem" }}></i>
              Sign Up / Login
            </>
          )}
        </button>

        {/* Menu Options */}
        <div style={{
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          gap: "10px",
          background: "#1c1f21",
          padding: "15px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
          animation: "fadeInDown 0.3s ease",
          minWidth: "220px"
        }}>
          {session ? (
            <>
              <div style={{ textAlign: "center", marginBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
                <img src={session.user?.image || "/images/default-avatar.png"} style={{ width: "50px", height: "50px", borderRadius: "50%", marginBottom: "5px" }} />
                <h4 style={{ margin: 0, color: "white", fontSize: "1rem" }}>{session.user?.name}</h4>
                <span style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 'bold' }}>{session.user?.email}</span>
              </div>
              <a href="/profile" className="auth-menu-btn" style={{ background: "#10b981" }}>
                <i className="fa-solid fa-user"></i> My Profile
              </a>
              <a href="/studio" className="auth-menu-btn" style={{ background: "#ef4444" }}>
                <i className="fa-brands fa-youtube"></i> Creator Studio
              </a>
              <button onClick={() => signOut()} className="auth-menu-btn" style={{ background: "#333" }}>
                <i className="fa-solid fa-sign-out"></i> Logout
              </button>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: "10px", color: "white" }}>
                <h4 style={{ margin: 0 }}>Join Pokefun</h4>
                <p style={{ fontSize: "0.8rem", color: "gray", margin: "5px 0 0 0" }}>Create account instantly</p>
              </div>
              <button onClick={() => signIn('discord')} className="auth-menu-btn" style={{ background: "#5865F2" }}>
                <i className="fa-brands fa-discord"></i> Create Account / Login (Discord)
              </button>
              <button onClick={() => signIn('google')} className="auth-menu-btn" style={{ background: "#db4437" }}>
                <i className="fa-brands fa-google"></i> Create Account / Login (Gmail)
              </button>
              <a href="/admin" className="auth-menu-btn" style={{ background: "transparent", border: "1px solid #444", color: "gray" }}>
                Admin Login
              </a>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        .auth-menu-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          border: none;
          padding: 12px 15px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: 0.2s;
          text-decoration: none;
          justify-content: flex-start;
        }
        .auth-menu-btn i {
          width: 20px;
          text-align: center;
        }
        .auth-menu-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.2);
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

"use client";

import React from "react";
import Image from "next/image";

import Link from "next/link";

export default function TeamPage() {
  const team = [
    {
      category: "Owner & Founder",
      members: [
        { name: "BOYS MSG", role: "Owner", color: "#ff4757", img: "/images/boysmsg.png", username: "boysmsg01" }
      ]
    },
    {
      category: "Moderation",
      members: [
        { name: "Smite", role: "Moderator", color: "#2f3542", img: "/images/smite.png" },
        { name: "DG", role: "Moderator", color: "#2f3542", img: "/images/dg4.png" },
        { name: "Aakash", role: "Moderator", color: "#2f3542", img: "/images/akash.png" }
      ]
    }
  ];

  return (
    <div className="inner" style={{ paddingTop: "80px", paddingBottom: "60px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "80px", color: "white" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "15px" }}>Staff Team</h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>Meet the amazing people behind Pokefun SMP!</p>
      </div>

      {team.map((group, idx) => (
        <div key={idx} style={{ marginBottom: "50px", background: "white", padding: "40px", borderRadius: "16px", border: "1px solid #eeeeee" }}>
          <h2 style={{ 
            fontSize: "1.8rem", 
            marginBottom: "30px", 
            paddingLeft: "15px", 
            borderLeft: "5px solid #2dc8ff",
            color: "#333333"
          }}>
            {group.category}
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "30px" 
          }}>
            {group.members.map((member, mIdx) => (
              <div key={mIdx} style={{ 
                background: "#f9f9f9", 
                borderRadius: "15px", 
                padding: "30px 20px", 
                textAlign: "center",
                border: "1px solid #eeeeee",
                transition: "transform 0.3s ease",
                cursor: "default"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "none"}
              >
                <div style={{ 
                  width: "100px", 
                  height: "100px", 
                  borderRadius: "50%", 
                  background: "#ffffff", 
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "3px solid " + member.color
                }}>
                  <img src={member.img} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/images/character.png" }} />
                </div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "5px", color: "#333" }}>{member.name}</h3>
                <div style={{ marginBottom: "15px" }}>
                  <span style={{ 
                    display: "inline-block", 
                    padding: "5px 15px", 
                    background: member.color, 
                    color: "white", 
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "bold"
                  }}>
                    {member.role}
                  </span>
                </div>
                {(member as any).username && (
                  <Link href={`/messages?user=${(member as any).username}`} style={{ display: 'inline-block', marginTop: '15px', background: '#10b981', color: 'white', padding: '8px 15px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.3s', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>
                    <i className="fa-solid fa-comment" style={{ marginRight: '8px' }}></i> Message
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

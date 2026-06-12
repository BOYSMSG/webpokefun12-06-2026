import React from "react";

export default function ChangelogsPage() {
  return (
    <div className="inner" style={{ padding: "80px 0", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "10px", fontWeight: 800 }}>
        Changelogs
      </h1>
      <p style={{ textAlign: "center", color: "gray", fontSize: "1.2rem", marginBottom: "50px" }}>
        Stay up to date with the latest server updates and patches.
      </p>

      <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255, 26, 117, 0.05)", borderRadius: "12px", border: "1px solid rgba(255, 26, 117, 0.2)" }}>
        <i className="fa-solid fa-clock" style={{ fontSize: "3rem", color: "var(--ghost-accent-color)", marginBottom: "20px" }}></i>
        <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Coming Soon</h2>
        <p style={{ color: "gray", fontSize: "1.1rem", marginTop: "10px" }}>
          We are just starting out! The first major changelogs will be posted here soon.
        </p>
      </div>
    </div>
  );
}

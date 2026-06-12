import React from "react";

export default function WikiGuidesIntroPage() {
  return (
    <div className="fakemon-card" style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "20px", color: "white" }}>
        Welcome to Pokefun Guides!
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#ccc", lineHeight: "1.6", marginBottom: "20px" }}>
        Whether you're a new trainer just starting out, or a veteran looking to master the most complex features of our server, you'll find everything you need right here.
      </p>
      
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "30px", marginBottom: "15px", color: "var(--ghost-accent-color)" }}>
        What's inside?
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        <li style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <i className="fa-solid fa-sword" style={{ color: "#2ed573", width: "20px" }}></i>
          <span><strong>Raid Guide:</strong> Learn how to conquer the toughest boss Pokemon.</span>
        </li>
        <li style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <i className="fa-solid fa-dungeon" style={{ color: "#2ed573", width: "20px" }}></i>
          <span><strong>Dungeon Guide:</strong> Navigate procedurally generated dungeons for epic loot.</span>
        </li>
        <li style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <i className="fa-solid fa-map" style={{ color: "#2ed573", width: "20px" }}></i>
          <span><strong>AlphaZone Guide:</strong> Survive and catch the elusive Alpha variants.</span>
        </li>
        <li style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <i className="fa-solid fa-trophy" style={{ color: "#2ed573", width: "20px" }}></i>
          <span><strong>Ranked Guide:</strong> Climb the competitive ladder and prove your skills.</span>
        </li>
        <li style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <i className="fa-solid fa-users" style={{ color: "#2ed573", width: "20px" }}></i>
          <span><strong>NPC Guide:</strong> Meet the quest-givers, merchants, and special characters.</span>
        </li>
        <li style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <i className="fa-solid fa-building" style={{ color: "#2ed573", width: "20px" }}></i>
          <span><strong>Gyms Guide:</strong> Defeat the gym leaders to earn your badges!</span>
        </li>
      </ul>

      <p style={{ marginTop: "30px", fontSize: "1rem", color: "gray" }}>
        Select a topic from the sidebar on the left to get started. Happy exploring!
      </p>
    </div>
  );
}

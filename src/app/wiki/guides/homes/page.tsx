"use client";

import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const homesContent = `
# HuskHomes Guide

Welcome to the **Homes & Teleportation Guide**! Here you'll find all the commands you can use on the server to set homes, teleport, and send teleport requests to other players.

By default, you have **3 Homes**. If you want more homes (e.g. 8, 20, 50+), you can buy Ranks at the [Server Store](https://pokefun.in/store).

| Command | Description |
|---|---|
| \`/home [name]\` | Teleport to one of your homes. |
| \`/homelist\` (or \`/homes\`) | View a list of your homes. |
| \`/sethome <name>\` | Set a new home with a name at your current location. |
| \`/delhome <name>\` | Delete a home you previously set. |
| \`/edithome <name>\` | View and edit information about a home. |
| \`/phome <name>\` | Teleport to a public home. |
| \`/phomelist\` (or \`/phomes\`) | View the list of public homes. |
| \`/warp <name>\` | Teleport to a server warp. |
| \`/warplist\` (or \`/warps\`) | View the list of server warps. |
| \`/spawn\` | Teleport to the server spawn position. |
| \`/tpa <username>\` | Send a request to teleport to another online user. |
| \`/tpahere <username>\` | Send a request asking another online user to teleport to you. |
| \`/tpaccept\` (or \`/tpyes\`) | Accept the last teleport request you received. |
| \`/tpdecline\` (or \`/tpno\`) | Decline the last teleport request you received. |
| \`/tpignore\` | Toggle whether to ignore incoming teleport requests. |
| \`/rtp\` | Teleport randomly into the wild in the current world. |
| \`/back\` | Teleport to your last position or where you last died. |

---
**Need more homes?**
Check out our [Ranks on the Store](https://pokefun.in/store) to upgrade your limits!
`;

export default function HomesGuidePage() {
  return (
    <div className="inner" style={{ paddingTop: "80px", paddingBottom: "60px", maxWidth: "900px", margin: "0 auto", color: "white" }}>
      <Link href="/wiki" style={{ color: "#a3a3a3", textDecoration: "none", marginBottom: "20px", display: "inline-block" }}>
        <i className="fa-solid fa-arrow-left"></i> Back to Wiki
      </Link>
      <div style={{ background: "rgba(30, 34, 39, 0.7)", padding: "40px", borderRadius: "16px", border: "1px solid #333", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--ghost-accent-color)", marginBottom: "20px", borderBottom: "2px solid #333", paddingBottom: "10px" }} {...props} />,
            h2: ({node, ...props}) => <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginTop: "30px", marginBottom: "15px" }} {...props} />,
            h3: ({node, ...props}) => <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#a3a3a3", marginTop: "20px", marginBottom: "10px" }} {...props} />,
            p: ({node, ...props}) => <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#d1d5db", marginBottom: "15px" }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ marginLeft: "20px", marginBottom: "15px", color: "#d1d5db" }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: "5px" }} {...props} />,
            a: ({node, ...props}) => <a style={{ color: "var(--ghost-accent-color)", textDecoration: "underline" }} {...props} />,
            table: ({node, ...props}) => <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", overflow: "hidden" }} {...props} />,
            th: ({node, ...props}) => <th style={{ background: "rgba(255,255,255,0.1)", padding: "12px", textAlign: "left", color: "white", borderBottom: "1px solid #444" }} {...props} />,
            td: ({node, ...props}) => <td style={{ padding: "12px", borderBottom: "1px solid #333", color: "#d1d5db" }} {...props} />,
            code: ({node, ...props}) => <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", color: "#facc15" }} {...props} />,
          }}
        >
          {homesContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}

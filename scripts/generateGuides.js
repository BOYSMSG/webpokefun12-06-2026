const fs = require('fs');
const path = require('path');
const dirs = ['raid', 'dungeon', 'alphazone', 'ranked', 'npc', 'gyms'];
dirs.forEach(d => {
  const dirPath = path.join('src/app/wiki/guides', d);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const compName = d.charAt(0).toUpperCase() + d.slice(1);
  const content = `import React from "react";

export default function ${compName}GuidePage() {
  return (
    <div className="fakemon-card" style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "20px" }}>${compName} Guide</h1>
      <p style={{ color: "#ccc" }}>Detailed information coming soon.</p>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});
console.log("Guides generated.");

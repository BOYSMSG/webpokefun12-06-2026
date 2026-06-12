const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src/app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// The lines were deleted up to the second fakemon-card. Let's insert them back properly.
const insertPoint = '<div id="tsparticles" style={{ zIndex: 1 }}></div>';

if (content.includes(insertPoint) && !content.includes('<main id="site-main"')) {
  const toInsert = `

      <main id="site-main" className="site-main outer" style={{ position: "relative", zIndex: 10 }}>
          <div className="inner posts">

              {/* ALL EPIC FEATURES */}
              <div className="inner" style={{ marginTop: "60px", marginBottom: "60px" }}>
                  <div style={{ textAlign: "center", marginBottom: "60px", marginTop: "20px" }}>
                      <h1 style={{ fontSize: "4rem", fontWeight: 900, color: "var(--accent-cyan)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "2px", textShadow: "0 4px 20px rgba(6, 182, 212, 0.4)" }}>Pokefun</h1>
                      <h2 style={{ fontSize: "1.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>The Best Cobblemon server</h2>
                  </div>
                  <div className="section-title" style={{ textAlign: "center", marginBottom: "40px", fontSize: "32px", fontWeight: 800 }}>EPIC SERVER FEATURES</div>
                  <div className="fakemons-grid">
                      
                      <div className="fakemon-card">
                          <img src="/images/features/image09_bosspokemons1.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Natural Bosses" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Natural Bosses</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Powerful bosses spawn naturally in the world! Defeat them for epic loot.</p>
`;
  content = content.replace(insertPoint, insertPoint + toInsert);
  fs.writeFileSync(pagePath, content);
  console.log('Fixed page.tsx');
} else {
  console.log('Could not fix page.tsx, manual check required.');
}

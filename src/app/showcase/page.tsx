import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function ShowcasePage() {
  // Read Main Images
  const mainImagesPath = path.join(process.cwd(), 'src/data/mainimages.json');
  let mainImages: any[] = [];
  if (fs.existsSync(mainImagesPath)) {
    mainImages = JSON.parse(fs.readFileSync(mainImagesPath, 'utf-8'));
  }

  // Read Fakemon Showcase
  const fakemonPath = path.join(process.cwd(), 'src/data/fakemon_showcase.json');
  let fakemons: any[] = [];
  if (fs.existsSync(fakemonPath)) {
    fakemons = JSON.parse(fs.readFileSync(fakemonPath, 'utf-8'));
  }

  // Read Cosmetics
  const cosmeticsPath = path.join(process.cwd(), 'src/data/cosmetics.json');
  let cosmetics: any[] = [];
  if (fs.existsSync(cosmeticsPath)) {
    cosmetics = JSON.parse(fs.readFileSync(cosmeticsPath, 'utf-8'));
  }

  // Read Features directly from public folder
  const featuresDir = path.join(process.cwd(), 'public/images/features');
  let features: any[] = [];
  if (fs.existsSync(featuresDir)) {
    const files = fs.readdirSync(featuresDir);
    features = files.filter(f => f.match(/\.(png|jpg|jpeg|webp|gif)$/i)).map(f => ({
      name: f.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      image: `/images/features/${f}`
    }));
  }

  // Read Showcase directory
  const showcaseDir = path.join(process.cwd(), 'public/images/showcase');
  let showcaseImages: any[] = [];
  if (fs.existsSync(showcaseDir)) {
    const files = fs.readdirSync(showcaseDir);
    showcaseImages = files.filter(f => f.match(/\.(png|jpg|jpeg|webp|gif|avif)$/i)).map(f => ({
      image: `/images/showcase/${f}`
    }));
  }

  return (
    <div className="wiki-container">
      <div className="inner" style={{ paddingTop: '80px' }}>
        <h1 className="wiki-title" style={{ textAlign: 'center', marginBottom: '10px', color: 'white', fontSize: '4rem', textShadow: '0 4px 8px rgba(0,0,0,0.6)' }}>PokeFun Showcase</h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', marginBottom: '40px', fontSize: '1.4rem' }}>Explore the massive world, custom Fakemons, Fusions, and Cosmetics.</p>
        
        {/* Main Images Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '10px', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Server Screenshots & Lobbies</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {mainImages.map((img, idx) => (
              <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: '#fff' }}>
                <img src={img.image} alt="Server Screenshot" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Epic Features Highlights</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', background: '#fff', textAlign: 'center' }}>
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', padding: '10px' }}>
                  <img src={feat.image} alt={feat.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} loading="lazy" />
                </div>
                <div style={{ padding: '10px', fontSize: '14px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {feat.name}
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* Fakemons & Fusions Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Fakemons & Fusions Gallery</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {fakemons.map((mon, idx) => (
              <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', background: '#fff', textAlign: 'center' }}>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '10px' }}>
                  <img src={mon.image} alt={mon.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} loading="lazy" />
                </div>
                <div style={{ padding: '10px', fontSize: '14px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {mon.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cosmetics Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Cosmetics & Skins</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
            {cosmetics.map((cos, idx) => (
              <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', background: '#fff', textAlign: 'center' }}>
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', padding: '10px' }}>
                  <img src={cos.image} alt={cos.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} loading="lazy" />
                </div>
                <div style={{ padding: '10px', fontSize: '14px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {cos.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* More Images / Showcase Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>In-Game Gallery</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {showcaseImages.map((img, idx) => (
              <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: '#fff' }}>
                <img src={img.image} alt="In-game moment" style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

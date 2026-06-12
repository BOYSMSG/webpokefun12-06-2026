const fs = require('fs');
const path = require('path');

const featuresPagePath = path.join(__dirname, 'src/app/wiki/guides/features/page.tsx');
let content = fs.readFileSync(featuresPagePath, 'utf8');

const imageMap = {
  'Natural Bosses': '/images/features/image09_bosspokemons1.png',
  'Custom Raids': '/images/features/image27_Team_Raids_Battle.png',
  'Battle Gimmicks': '/images/features/megapokemons-1.png',
  'Pokémon Fusion': '/images/features/fusion pokemons1.png',
  'Gym System': '/images/features/image13_customeforms.png',
  'Cosmetic Skins': '/images/features/cosmetic skins1.png',
  'Player Economy': '/images/features/hugecity2.png',
  'Alpha Pokémon': '/images/features/cool spawn-2.png',
  'Dungeon System': '/images/features/dungeon.png',
  'Ranked Battle Tower': '/images/features/battletower.png',
  'Starter Kits': '/images/features/pokefun.png',
  'BattlePass & Events': '/images/features/safarizone.png'
};

// Add CSS for images
if (!content.includes('.feature-card-img')) {
  content = content.replace('.feature-card {', '.feature-card-img { width: 100%; height: 150px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; }\n        .feature-card {');
}

// Inject images before the feature-icon or h3
for (const [title, imgPath] of Object.entries(imageMap)) {
  const regex = new RegExp(`(<div class="feature-card">\\s*<div class="feature-icon">[\\s\\S]*?<h3>${title})`);
  content = content.replace(regex, `<div class="feature-card">\n                <img src="${imgPath}" alt="${title}" class="feature-card-img" />\n                <div class="feature-icon">$1`.replace('<div class="feature-card">', ''));
}

fs.writeFileSync(featuresPagePath, content);
console.log('Updated features page with images');

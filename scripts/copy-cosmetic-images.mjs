import fs from 'fs';
import path from 'path';

const SRC_DIR = "D:/Downloads/websitework/website/cosmeticpokemons/coole skins/Pokemon Skins";
const DEST_DIR = path.join(process.cwd(), 'public/images/cosmetics');
const OUTPUT_JSON = path.join(process.cwd(), 'src/data/cosmetics.json');

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

let cosmeticsList = [];

function copyCosmetics() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Source directory not found: ${SRC_DIR}`);
    return;
  }
  
  const entries = fs.readdirSync(SRC_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
      const srcPath = path.join(SRC_DIR, entry.name);
      const destPath = path.join(DEST_DIR, entry.name);
      try {
        fs.copyFileSync(srcPath, destPath);
        cosmeticsList.push({
          filename: entry.name,
          name: entry.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
          image: `/images/cosmetics/${entry.name}`
        });
      } catch (e) {
        console.error(`Error copying ${entry.name}:`, e.message);
      }
    }
  }
}

console.log('Copying Cosmetic textures...');
copyCosmetics();

// Ensure the directory exists
const outputDir = path.dirname(OUTPUT_JSON);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_JSON, JSON.stringify(cosmeticsList, null, 2));

console.log(`Successfully copied ${cosmeticsList.length} cosmetics to ${DEST_DIR}`);
console.log(`Successfully wrote metadata to ${OUTPUT_JSON}`);

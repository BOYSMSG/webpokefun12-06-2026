import fs from 'fs';
import path from 'path';

const SRC_DIR = "D:/Downloads/websitework/website/websites/mainimages";
const DEST_DIR = path.join(process.cwd(), 'public/images/mainimages');
const OUTPUT_JSON = path.join(process.cwd(), 'src/data/mainimages.json');

if (fs.existsSync(DEST_DIR)) {
  fs.rmSync(DEST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DEST_DIR, { recursive: true });

let imageList = [];

function copyImages() {
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
        imageList.push({
          filename: entry.name,
          image: `/images/mainimages/${entry.name}`
        });
      } catch (e) {
        console.error(`Error copying ${entry.name}:`, e.message);
      }
    }
  }
}

console.log('Copying Main Images...');
copyImages();

// Ensure the directory exists
const outputDir = path.dirname(OUTPUT_JSON);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_JSON, JSON.stringify(imageList, null, 2));

console.log(`Successfully copied ${imageList.length} main images to ${DEST_DIR}`);

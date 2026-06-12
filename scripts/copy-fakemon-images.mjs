import fs from 'fs';
import path from 'path';

const SRC_DIRS = [
  "D:/Downloads/websitework/website/fakemons_fusions_eveelutions_images_and_details/Fakemon Images",
  "D:/Downloads/websitework/website/fakemons_fusions_eveelutions_images_and_details/Fusion pokemons",
  "D:/Downloads/websitework/website/fakemons_fusions_eveelutions_images_and_details/Cobble Cafe",
  path.join(process.cwd(), '../fakemons/SpaceworldMons-3.0-1.21.1/spacemonspokemongroupimages')
];
const DEST_DIR = path.join(process.cwd(), 'public/images/fakemons');
const FAKEMONS_JSON = path.join(process.cwd(), 'src/data/fakemons.json');
const SHOWCASE_JSON = path.join(process.cwd(), 'src/data/fakemon_showcase.json');

// Ensure directories exist
if (fs.existsSync(DEST_DIR)) {
  fs.rmSync(DEST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DEST_DIR, { recursive: true });

let showcaseList = [];

// Step 1: Copy all files from the high-quality directories
function copyImages() {
  for (const srcDir of SRC_DIRS) {
    if (!fs.existsSync(srcDir)) continue;
    
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
        const srcPath = path.join(srcDir, entry.name);
        // Clean filename for URL safety
        const safeName = entry.name.replace(/[^a-zA-Z0-9.\-_ ]/g, '');
        const destPath = path.join(DEST_DIR, safeName);
        
        try {
          fs.copyFileSync(srcPath, destPath);
          showcaseList.push({
            filename: safeName,
            name: entry.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            image: `/images/fakemons/${safeName}`
          });
        } catch (e) {
          console.error(`Error copying ${entry.name}:`, e.message);
        }
      }
    }
  }
}

console.log('Copying high-quality Fakemon renders and GIFs...');
copyImages();

// Step 2: Read existing fakemons.json and attempt to map high-quality images to them
if (fs.existsSync(FAKEMONS_JSON)) {
  let fakemonsData = JSON.parse(fs.readFileSync(FAKEMONS_JSON, 'utf-8'));
  let mappedCount = 0;

  for (let mon of fakemonsData) {
    // Try to find a matching image in showcaseList by fuzzy matching names
    const monIdClean = mon.id.replace(/-/g, '').toLowerCase();
    const monNameClean = mon.name.replace(/-/g, '').toLowerCase();
    
    let bestMatch = showcaseList.find(img => {
      const imgNameClean = img.name.replace(/ /g, '').toLowerCase();
      return imgNameClean.includes(monIdClean) || imgNameClean.includes(monNameClean);
    });

    if (bestMatch) {
      mon.customImage = bestMatch.image;
      mappedCount++;
    } else {
      mon.customImage = null; // Will fallback in UI
    }
  }

  fs.writeFileSync(FAKEMONS_JSON, JSON.stringify(fakemonsData, null, 2));
  console.log(`Mapped custom images to ${mappedCount} out of ${fakemonsData.length} Fakemons in Dex.`);
}

// Step 3: Write the showcase json for the showcase gallery
fs.writeFileSync(SHOWCASE_JSON, JSON.stringify(showcaseList, null, 2));
console.log(`Saved ${showcaseList.length} items to fakemon_showcase.json`);

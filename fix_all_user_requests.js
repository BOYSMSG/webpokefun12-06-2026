const fs = require('fs');
const path = require('path');

// 1. Home page image size and 'Nova' removal
const homePath = path.join(__dirname, 'src/app/page.tsx');
let home = fs.readFileSync(homePath, 'utf8');
// Replace className="fakemon-img" with inline styles for 1.5x size
home = home.replace(/className="fakemon-img"/g, 'style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }}');
home = home.replace(/Nova Raids/g, 'Raids');
home = home.replace(/NovaRaid/g, 'Raid');
home = home.replace(/Nova Raid/g, 'Raid');
fs.writeFileSync(homePath, home);

// 2. Banner images in guides
const guidesDir = path.join(__dirname, 'src/app/wiki/guides');
const guideBanners = {
  'raid': '/images/features/image27_Team_Raids_Battle.png',
  'battletower': '/images/features/battletower.png',
  'npc': '/images/features/image13_customeforms.png',
  'gyms': '/images/features/image13_customeforms.png',
  'alphazone': '/images/features/cool spawn-2.png',
  'dungeon': '/images/features/dungeon.png',
  'cobblebosses': '/images/features/image09_bosspokemons1.png',
  'fusion': '/images/features/fusion pokemons1.png',
  'ranked': '/images/features/teambattles.png'
};

const guides = fs.readdirSync(guidesDir);
for (const guide of guides) {
  if (guide === 'features' || guide === '[id]') continue;
  const pagePath = path.join(guidesDir, guide, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    content = content.replace(/Nova Raids/g, 'Raids');
    content = content.replace(/NovaRaid/g, 'Raid');
    content = content.replace(/Nova Raid/g, 'Raid');
    content = content.replace(/Nova/g, 'Raid');

    if (guideBanners[guide] && !content.includes('guide-banner-img')) {
      // Find the first h1 or h2 and insert image before it
      const h1Regex = /(<h1[^>]*>[\s\S]*?<\/h1>)/i;
      const bannerHtml = `<img src="${guideBanners[guide]}" alt="${guide}" class="guide-banner-img" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} />`;
      if (h1Regex.test(content)) {
        content = content.replace(h1Regex, bannerHtml + '\n      $1');
      }
    }
    fs.writeFileSync(pagePath, content);
  }
}

// 3. Update Fakemons and Fusions to have multiple images
const fakemonsPath = path.join(__dirname, 'src/data/fakemons.json');
let fakemons = JSON.parse(fs.readFileSync(fakemonsPath, 'utf8'));

const sourceDirs = [
  'D:/Downloads/websitework/website/images',
  'D:/Downloads/websitework/website/fakemons_fusions_eveelutions_images_and_details'
];

const destDir = path.join(__dirname, 'public/images/fakemons');

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      if (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

let allSourceImages = [];
for (const dir of sourceDirs) {
  allSourceImages = allSourceImages.concat(getAllFiles(dir));
}

for (let i = 0; i < fakemons.length; i++) {
  const mon = fakemons[i];
  mon.allImages = []; // New array to store all forms/shinies
  
  const searchTerms = [
    mon.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    mon.id.toLowerCase().replace(/[^a-z0-9]/g, '')
  ];
  if (mon.id.includes('eeveelution')) {
    searchTerms.push(mon.name.toLowerCase());
  }

  for (const src of allSourceImages) {
    const basename = path.basename(src).toLowerCase().replace(/[^a-z0-9_]/g, '');
    for (const term of searchTerms) {
      if (basename.includes(term)) {
        // Copy this image
        const newFilename = `${mon.id}_${path.basename(src).replace(/[^a-zA-Z0-9.\-]/g, '_')}`;
        const destPath = path.join(destDir, newFilename);
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(src, destPath);
        }
        if (!mon.allImages.includes(`/images/fakemons/${newFilename}`)) {
          mon.allImages.push(`/images/fakemons/${newFilename}`);
        }
        break; // matched this image for this mon, move to next image
      }
    }
  }
}
fs.writeFileSync(fakemonsPath, JSON.stringify(fakemons, null, 2));
console.log('Script completed!');

const fs = require('fs');
const path = require('path');

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

let fixedCount = 0;

for (let i = 0; i < fakemons.length; i++) {
  const mon = fakemons[i];
  const expectedDestPath = path.join(destDir, `${mon.id}.png`);
  if (!fs.existsSync(expectedDestPath)) {
    const searchTerms = [
      mon.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      mon.id.toLowerCase().replace(/[^a-z0-9]/g, '')
    ];
    
    // For eeveelution extra, names might just be 'acideon'
    if (mon.id.includes('eeveelution')) {
      searchTerms.push(mon.name.toLowerCase());
    }
    
    let matchedPath = null;
    for (const src of allSourceImages) {
      const basename = path.basename(src).toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const term of searchTerms) {
          if (basename.includes(term) && !basename.includes('shiny')) {
            matchedPath = src;
            break;
          }
      }
      if (matchedPath) break;
    }
    
    if (matchedPath) {
      fs.copyFileSync(matchedPath, expectedDestPath);
      mon.image = `/images/fakemons/${mon.id}.png`;
      fixedCount++;
      console.log(`Copied image for ${mon.name} from ${path.basename(matchedPath)}`);
    } else {
      console.log(`WARN: Could not find image for ${mon.name} (ID: ${mon.id})`);
    }
  }
}

fs.writeFileSync(fakemonsPath, JSON.stringify(fakemons, null, 2));
console.log(`Fixed ${fixedCount} missing fakemon images.`);

const fs = require('fs');
const path = require('path');

const fakemonsPath = path.join(__dirname, 'src/data/fakemons.json');
let fakemons = JSON.parse(fs.readFileSync(fakemonsPath, 'utf8'));

const sourceDir = 'D:/Downloads/websitework/website/images';
const destDir = path.join(__dirname, 'public/images/fakemons');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function getAllFiles(dir, fileList = []) {
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

const allSourceImages = getAllFiles(sourceDir);

let fixedCount = 0;

for (let i = 0; i < fakemons.length; i++) {
  const mon = fakemons[i];
  if (!mon.image || mon.image === '' || mon.image === `/images/fakemons/${mon.id}.png`) {
    // Check if the image actually exists at the destination
    const expectedDestPath = path.join(destDir, `${mon.id}.png`);
    if (!fs.existsSync(expectedDestPath)) {
      // Find a matching image in the source folder
      // Eeveelution extra has names like 'bouldeon', IDs like 'eeveelution_extra_bouldeon'
      const searchTerms = [
        mon.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        mon.id.toLowerCase().replace(/[^a-z0-9]/g, '')
      ];
      
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
    } else {
      // It exists, make sure the JSON points to it
      mon.image = `/images/fakemons/${mon.id}.png`;
    }
  }
}

fs.writeFileSync(fakemonsPath, JSON.stringify(fakemons, null, 2));
console.log(`Fixed ${fixedCount} missing fakemon images.`);

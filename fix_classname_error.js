const fs = require('fs');
const path = require('path');

const guidesDir = path.join(__dirname, 'src/app/wiki/guides');

function fixClass(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fixClass(filePath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('class="guide-banner-img"')) {
        content = content.replace(/class="guide-banner-img"/g, 'className="guide-banner-img"');
        fs.writeFileSync(filePath, content);
      }
    }
  }
}

fixClass(guidesDir);
console.log('Fixed class -> className in guides');

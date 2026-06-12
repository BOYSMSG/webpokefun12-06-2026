const fs = require('fs');
const path = require('path');

const publicDirs = [
    path.join(__dirname, 'public/images/fakemons'),
    path.join(__dirname, 'public/images/fusions')
];

const dataFiles = [
    path.join(__dirname, 'src/data/fakemons.json'),
    path.join(__dirname, 'src/data/fusions.json'),
    path.join(__dirname, 'src/data/fakemon_showcase.json')
];

// Load all images from the directories
const allImageFiles = [];
for (const dir of publicDirs) {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            allImageFiles.push({ file: file, dir: dir.includes('fakemons') ? 'fakemons' : 'fusions' });
        }
    }
}

// Process each data file
for (const dataFile of dataFiles) {
    if (!fs.existsSync(dataFile)) continue;
    let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    
    let updatedCount = 0;
    
    for (let mon of data) {
        if (!mon.name) continue;
        const nameLower = mon.name.toLowerCase();
        
        // Find all images containing the mon's name
        const matchingImages = allImageFiles.filter(img => 
            img.file.toLowerCase().includes(nameLower)
        );
        
        if (matchingImages.length > 0) {
            mon.allImages = matchingImages.map(img => `/images/${img.dir}/${img.file}`);
            updatedCount++;
        }
    }
    
    if (updatedCount > 0) {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        console.log(`Updated ${updatedCount} entries in ${path.basename(dataFile)} to include all images (including gifs)`);
    }
}

import fs from 'fs';
import path from 'path';

const SRC_DIR = "D:/Downloads/websitework/website/websites/feturesdetail";
const OUTPUT_JSON = path.join(process.cwd(), 'src/data/guides.json');

let guides = [];

if (fs.existsSync(SRC_DIR)) {
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html'));
  
  for (const file of files) {
    const id = file.replace('.html', '');
    const content = fs.readFileSync(path.join(SRC_DIR, file), 'utf-8');
    
    // Extract everything between <body> and </body>
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let htmlContent = bodyMatch ? bodyMatch[1] : content;
    
    // Strip inline scripts if any
    htmlContent = htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Extract Title from <h1>
    const titleMatch = htmlContent.match(/<h1>(.*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : id.toUpperCase();
    
    guides.push({
      id,
      title,
      content: htmlContent
    });
  }
}

const outputDir = path.dirname(OUTPUT_JSON);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_JSON, JSON.stringify(guides, null, 2));
console.log(`Processed ${guides.length} guides into guides.json`);

const fs = require('fs');
const path = require('path');

const filesToFix = [
  "D:\\Downloads\\websitework\\website\\pokefun-nextjs-app\\src\\app\\api\\admin\\posts\\route.ts",
  "D:\\Downloads\\websitework\\website\\pokefun-nextjs-app\\src\\app\\api\\admin\\users\\route.ts",
  "D:\\Downloads\\websitework\\website\\pokefun-nextjs-app\\src\\app\\api\\messages\\read\\route.ts",
  "D:\\Downloads\\websitework\\website\\pokefun-nextjs-app\\src\\app\\api\\messages\\unread\\route.ts",
  "D:\\Downloads\\websitework\\website\\pokefun-nextjs-app\\src\\app\\api\\profile\\route.ts",
  "D:\\Downloads\\websitework\\website\\pokefun-nextjs-app\\src\\app\\api\\studio\\route.ts"
];

for (const file of filesToFix) {
  let content = fs.readFileSync(file, 'utf-8');
  
  if (content.includes('getServerSession()')) {
    // Add import if not exists
    if (!content.includes('authOptions')) {
      content = content.replace(
        "import { getServerSession } from 'next-auth';",
        "import { getServerSession } from 'next-auth';\nimport { authOptions } from '@/app/api/auth/[...nextauth]/route';"
      );
    }
    
    // Replace all occurrences
    content = content.replace(/getServerSession\(\)/g, "getServerSession(authOptions)");
    
    fs.writeFileSync(file, content);
    console.log("Fixed:", file);
  }
}

const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('BROWSER CONSOLE ERROR:', msg.text());
      }
    });

    page.on('pageerror', err => {
      console.log('BROWSER PAGE ERROR:', err.toString());
    });

    console.log('Navigating to http://localhost:3000/admin/store-config');
    await page.goto('http://localhost:3000/admin/store-config', { waitUntil: 'networkidle2' });
    
    // Check if error boundary is visible
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes("This page couldn't load")) {
      console.log("CRASH REPRODUCED: Error boundary is visible!");
    } else {
      console.log("No crash detected. Page loaded successfully.");
    }
    
    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

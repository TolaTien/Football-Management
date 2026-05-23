const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  // Set the token
  await page.goto('http://localhost:8001/auth/login');
  await page.evaluate(() => {
    localStorage.setItem('pitchhub_token', 'dummy_token_for_test');
  });

  await page.goto('http://localhost:8001/user/dashboard', { waitUntil: 'networkidle2' });
  const content = await page.content();
  console.log("Root element contains:", await page.$eval('#root', el => el.innerHTML).catch(e => "Root not found"));
  
  await browser.close();
})();

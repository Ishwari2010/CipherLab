import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Pipe console logs to stdout
    page.on('console', msg => console.log(msg.text()));

    await page.goto('http://localhost:5173');

    // Navigate to Rail Fence
    await page.click('text=Rail Fence');

    // Fill input
    await page.fill('textarea', 'TESTMESSAGE');

    console.log('--- CLICKING ENCRYPT ---');
    await page.click('button:has-text("Encrypt")');
    await page.waitForTimeout(500); // give React time to render

    console.log('--- CLICKING DECRYPT ---');
    await page.click('button:has-text("Decrypt")');
    await page.waitForTimeout(500); // give React time to render

    await browser.close();
})();

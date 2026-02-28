import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 558 });
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000); // Wait for render

    const overflowData = await page.evaluate(() => {
        const results = [];
        const h1 = document.documentElement.scrollHeight;
        const h2 = document.documentElement.clientHeight;
        const innerH = window.innerHeight;

        const elements = [...document.querySelectorAll('*')];
        elements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            if (rect.bottom > window.innerHeight) {
                // Ignore script, style, meta, head, etc. 
                if (['SCRIPT', 'STYLE', 'META', 'HEAD', 'TITLE', 'LINK', 'NOSCRIPT'].includes(el.tagName)) return;

                // Collect basic info
                results.push({
                    tagName: el.tagName,
                    id: el.id,
                    className: el.className,
                    bottom: rect.bottom,
                    height: rect.height,
                    computedHeight: window.getComputedStyle(el).height
                });
            }
        });

        return {
            scrollHeight: h1,
            clientHeight: h2,
            innerHeight: innerH,
            overflowingElements: results
        };
    });

    fs.writeFileSync('dom_overflow_audit.json', JSON.stringify(overflowData, null, 2));
    await browser.close();
})();

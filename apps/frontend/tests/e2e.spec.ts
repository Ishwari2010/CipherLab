import { test, expect } from '@playwright/test';

test('has title and can encrypt basic caesar', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page.getByText(/CipherLab/i)).toBeVisible();

    // Fill in textarea
    await page.fill('textarea', 'HELLO E2E TEST');

    // Click Encrypt
    await page.click('text=Encrypt');

    // Check the result
    const result = page.getByTestId('cipher-output');
    await expect(result).toBeVisible();

    // For 'HELLO E2E TEST' shifted by 3 with preserve case:
    // H->K, E->H, L->O, O->R
    // E->H, 2 (ignored), E->H
    // T->W, E->H, S->V, T->W
    // KHOOR H2H WHVW
    await expect(result).toContainText('KHOOR H2H WHVW');
});

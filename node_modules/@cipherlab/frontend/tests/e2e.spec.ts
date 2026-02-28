import { test, expect } from '@playwright/test';

test('has title and can encrypt basic caesar', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page.getByText(/CipherLab/i)).toBeVisible();

    // Fill in textarea
    await page.fill('textarea', 'HELLO EEE TEST');

    // Click Encrypt
    await page.getByRole('button', { name: /^Encrypt$/ }).click();

    // Check the result
    const result = page.getByTestId('cipher-output');
    await expect(result).toBeVisible();

    // For 'HELLO EEE TEST' shifted by 3 with preserve case:
    // H->K, E->H, L->O, O->R
    // E->H, E->H, E->H
    // T->W, E->H, S->V, T->W
    // KHOOR HHH WHVW
    await expect(result).toContainText('KHOOR HHH WHVW');
});

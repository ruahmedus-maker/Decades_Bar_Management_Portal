import { test, expect } from '@playwright/test';

test.describe('Bartender Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#login-barrier')).toBeVisible();
        await page.click('button:has-text("Bartender")');
        await page.waitForSelector('#login-barrier', { state: 'hidden', timeout: 30000 });
        await expect(page.locator('.sidebar')).toBeVisible({ timeout: 15000 });
    });

    test('should navigate through major training sections', async ({ page }) => {
        const sections = [
            'Training Materials',
            'Cocktail Recipes',
            'Standard Procedures',
            'Aloha POS',
            'Bar Cleanings',
        ];

        for (const section of sections) {
            await page.click(`.sidebar a:has-text("${section}")`);
            await expect(page.locator('.main-content')).toBeVisible();
            // Verify content-wrapper has some child elements (content is rendered)
            await expect(page.locator('.content-wrapper > *')).toBeVisible();
        }
    });

    test('should open cocktail recipes', async ({ page }) => {
        await page.click(`.sidebar a:has-text("Cocktail Recipes")`);
        await expect(page.locator('.main-content')).toBeVisible();
        // Check for any text common in cards or grids
        await expect(page.locator('.main-content')).toContainText(/Cocktail|Recipe|Signature|Drink/i);
    });

    test('should access training tests', async ({ page }) => {
        await page.click(`.sidebar a:has-text("Training Tests")`);
        await expect(page.locator('.main-content')).toBeVisible();
        await expect(page.locator('.main-content')).toContainText(/Test|Take|Question/i);
    });

    test('should render training materials with progress', async ({ page }) => {
        await page.click(`.sidebar a:has-text("Training Materials")`);
        await expect(page.locator('.main-content')).toBeVisible();
        await expect(page.locator('.main-content')).toContainText(/Training|Curriculum|Progress/i);
    });
});

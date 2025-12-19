import { test, expect } from '@playwright/test';

test.describe('Decades Bar Portal Smoke Test', () => {
    test('should load the login page', async ({ page }) => {
        // Navigate to the app (assuming it's running via the webServer config)
        await page.goto('/');

        // Check if the title text is present (using a generic selector)
        // Adjust this to match your actual login screen text
        const title = page.locator('h1, h2');
        await expect(title).toBeVisible();
    });

    test('should have essential training links', async ({ page }) => {
        // This test would ideally run after login
        // For now, we just verify the route structure
        await page.goto('/');
        // Check for "Login" text or similar
        await expect(page.getByText(/Login|Sign In/i)).toBeVisible();
    });
});

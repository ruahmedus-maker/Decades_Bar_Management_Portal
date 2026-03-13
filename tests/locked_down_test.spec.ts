import { test, expect } from '@playwright/test';

test.describe('Locked-Down Test Mode Isolation', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate with the testing flag enabled and bypass the fullscreen requirement
        await page.goto('/?enableTests=true&bypassFullscreen=true');
        
        // Login as bartender
        await expect(page.locator('#login-barrier')).toBeVisible();
        await page.click('button:has-text("Bartender")');
        
        // Wait for the loader to clear
        await page.waitForSelector('#login-barrier', { state: 'hidden', timeout: 30000 });
    });

    test('should NOT show Sidebar or Header in test mode', async ({ page }) => {
        // With bypassFullscreen=true, we should go straight to the secure exam interface
        await expect(page.locator('text=SECURE EXAMINATION')).toBeVisible();
        
        // Sidebar and normal Header should NOT be in the DOM or at least not visible
        const sidebar = page.locator('.sidebar');
        const header = page.locator('header');
        
        await expect(sidebar).not.toBeVisible();
        await expect(header).not.toBeVisible();
    });

    test('should show correct candidate name and secure top bar', async ({ page }) => {
        // Check for the presence of the secure top bar
        await expect(page.locator('text=SECURE EXAMINATION')).toBeVisible();
        
        // Candidate info block
        await expect(page.locator('text=CANDIDATE')).toBeVisible();
    });

    test('should render standalone TestsSection content', async ({ page }) => {
        // Verify the actual test content is rendered within the secure container
        await expect(page.locator('text=Available Tests')).toBeVisible();
    });
});

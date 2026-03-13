import { test, expect } from '@playwright/test';

test.describe('Notification System', () => {
    test('should send checkout notification from Bartender to Admin', async ({ page, browser }) => {
        // 1. Bartender Role: Send Checkout Request
        await page.goto('/?enableTests=false');
        
        const bartenderButton = page.locator('button', { hasText: 'Bartender' });
        await expect(bartenderButton).toBeVisible({ timeout: 20000 });
        await bartenderButton.click();
        
        await page.waitForSelector('#login-barrier', { state: 'hidden', timeout: 20000 });
        await expect(page.locator('.sidebar')).toBeVisible({ timeout: 20000 });
        
        const sopLink = page.locator('.sidebar a', { hasText: /Standard Procedures/i });
        await expect(sopLink).toBeVisible({ timeout: 15000 });
        await sopLink.click();
        
        await expect(page.locator('h3:has-text("Operating SOPs")')).toBeVisible({ timeout: 15000 });
        
        // Complete closing tasks
        await page.click('text=/Count register drawer/i');
        await page.click('text=/Complete end-of-shift report/i');
        await page.click('text=/Return bank bag/i');
        
        // Click READY FOR CHECKOUT
        const checkoutBtn = page.locator('button:has-text("READY FOR CHECKOUT")');
        await expect(checkoutBtn).toBeEnabled();
        await checkoutBtn.click();
        
        // Verify toast on bartender side - Fail if 'Notification error' appears
        const toast = page.locator('.toast');
        await expect(toast).not.toContainText(/Notification error/i, { timeout: 10000 });
        await expect(toast).toContainText(/Manager notified/i, { timeout: 15000 });
        
        // 2. Admin Role: Verify Notification
        const adminContext = await browser.newContext();
        const adminPage = await adminContext.newPage();
        await adminPage.goto('/');
        
        const adminButton = adminPage.locator('button', { hasText: 'Admin' });
        await expect(adminButton).toBeVisible({ timeout: 20000 });
        await adminButton.click();
        
        await adminPage.waitForSelector('#login-barrier', { state: 'hidden', timeout: 20000 });
        
        // Check for toast notification on Admin side
        const adminToast = adminPage.locator('.toast');
        await expect(adminToast).toContainText(/🔔.*Checkout/i, { timeout: 25000 });
        
        // Open Notification Center
        await adminPage.click('button[title="Notifications"]');
        await expect(adminPage.locator('.max-h-96')).toContainText(/Checkout/i, { timeout: 10000 });
        
        await adminContext.close();
    });

    test('should send test passed notification from Bartender to Admin', async ({ page, browser }) => {
        // 1. Bartender Role: Pass a Test
        await page.goto('/?enableTests=true');
        
        const bartenderButton = page.locator('button', { hasText: 'Bartender' });
        await expect(bartenderButton).toBeVisible({ timeout: 20000 });
        await bartenderButton.click();
        
        await page.waitForSelector('#login-barrier', { state: 'hidden', timeout: 20000 });
        
        // Wait for Training Tests card to load (header is hidden in standalone)
        await expect(page.locator('h4', { hasText: /Available Tests/i })).toBeVisible({ timeout: 15000 });
        
        // Select a test
        const startTestButton = page.locator('button', { hasText: /Start Test/i }).first();
        await expect(startTestButton).toBeVisible({ timeout: 15000 });
        await startTestButton.click();
        
        // Answer questions correctly
        await page.click('text=/Check the daily specials/i');
        await page.click('text=/Politely refuse service/i');
        await page.click('text=/Use the .*Split Check.* function/i');
        
        // Submit
        await page.click('button:has-text("Submit Test")');
        
        // Verify passing toast
        await expect(page.locator('.toast')).toContainText(/PASSED/i, { timeout: 15000 });
        
        // 2. Admin Role: Verify Notification
        const adminContext = await browser.newContext();
        const adminPage = await adminContext.newPage();
        await adminPage.goto('/');
        
        const adminButton = adminPage.locator('button', { hasText: 'Admin' });
        await expect(adminButton).toBeVisible({ timeout: 20000 });
        await adminButton.click();
        
        await adminPage.waitForSelector('#login-barrier', { state: 'hidden', timeout: 20000 });
        
        // Check for toast notification
        const adminToast = adminPage.locator('.toast');
        await expect(adminToast).toContainText(/🔔.*Test Passed/i, { timeout: 25000 });
        
        // Open Notification Center
        await adminPage.click('button[title="Notifications"]');
        await expect(adminPage.locator('.max-h-96')).toContainText(/Test Passed/i, { timeout: 10000 });
        
        await adminContext.close();
    });
});

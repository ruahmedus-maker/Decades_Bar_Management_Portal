import { test, expect } from '@playwright/test';
import { setupTestUsers } from '../src/lib/supabase-auth';

test.describe('Notification System', () => {
    test.beforeAll(async () => {
        await setupTestUsers();
    });

    test('should send checkout notification from Bartender to Admin', async ({ browser }) => {
        const bartenderContext = await browser.newContext();
        const bartenderPage = await bartenderContext.newPage();
        const adminContext = await browser.newContext();
        const adminPage = await adminContext.newPage();

        // 1. Admin Role: Login and wait for clear state
        await adminPage.goto('/');
        await adminPage.locator('button', { hasText: 'Admin' }).click();
        await adminPage.waitForSelector('#login-barrier', { state: 'hidden', timeout: 20000 });
        
        // Wait for "Welcome back" toast to clear
        await expect(adminPage.locator('.toast')).toContainText(/Welcome back/i);
        await expect(adminPage.locator('.toast')).not.toBeVisible({ timeout: 15000 });

        // 2. Bartender Role: Send Checkout Request
        await bartenderPage.goto('/?enableTests=false');
        await bartenderPage.locator('button', { hasText: 'Bartender' }).click();
        await bartenderPage.waitForSelector('#login-barrier', { state: 'hidden', timeout: 20000 });
        
        await bartenderPage.locator('.sidebar a', { hasText: /Standard Procedures/i }).click();
        
        await bartenderPage.click('text=/Count register drawer/i');
        await bartenderPage.click('text=/Complete end-of-shift report/i');
        await bartenderPage.click('text=/Return bank bag/i');
        await bartenderPage.locator('button', { hasText: 'READY FOR CHECKOUT' }).click();
        
        // 3. Verify on both sides
        await expect(bartenderPage.locator('.toast')).toContainText(/Manager notified/i, { timeout: 15000 });
        
        // Admin should see notification in the list
        await adminPage.click('button[title="Notifications"]');
        await expect(adminPage.locator('.max-h-96')).toContainText(/Checkout/i, { timeout: 20000 });
        
        await bartenderContext.close();
        await adminContext.close();
    });

    test('should send test passed notification from Bartender to Admin', async ({ browser }) => {
        const bartenderContext = await browser.newContext();
        const bartenderPage = await bartenderContext.newPage();
        const adminContext = await browser.newContext();
        const adminPage = await adminContext.newPage();

        adminPage.on('console', msg => console.log(`[Admin] ${msg.text()}`));
        bartenderPage.on('console', msg => console.log(`[Bartender] ${msg.text()}`));

        // 1. Admin Role: Login
        await adminPage.goto('/');
        await adminPage.locator('button', { hasText: 'Admin' }).click();
        await adminPage.waitForSelector('#login-barrier', { state: 'hidden', timeout: 20000 });

        // 2. Bartender Role: Pass a Test
        await bartenderPage.goto('/?enableTests=true');
        await bartenderPage.locator('button', { hasText: 'Bartender' }).click();
        await bartenderPage.waitForSelector('#login-barrier', { state: 'hidden', timeout: 20000 });
        
        await bartenderPage.locator('button', { hasText: /Start Test/i }).first().click();
        await bartenderPage.click('text=/Check the daily specials/i');
        await bartenderPage.click('text=/Politely refuse service/i');
        await bartenderPage.click('text=/Use the .*Split Check.* function/i');
        await bartenderPage.locator('button', { hasText: 'Submit Test' }).click();
        
        // 3. Verify on both sides
        await expect(bartenderPage.locator('.toast')).toContainText(/PASSED/i, { timeout: 15000 });
        
        // Admin should see notification in the list
        await adminPage.click('button[title="Notifications"]');
        await expect(adminPage.locator('.max-h-96')).toContainText(/Test Passed/i, { timeout: 20000 });
        
        await bartenderContext.close();
        await adminContext.close();
    });
});

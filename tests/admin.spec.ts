import { test, expect } from '@playwright/test';

test.describe('Admin Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#login-barrier')).toBeVisible();
        await page.click('button:has-text("Admin")');
        await page.waitForSelector('#login-barrier', { state: 'hidden', timeout: 30000 });
        await expect(page.locator('.sidebar')).toBeVisible({ timeout: 15000 });
    });

    test('should access Admin Panel', async ({ page }) => {
        await page.click('.sidebar a:has-text("Admin Panel")');
        await expect(page.locator('.main-content')).toBeVisible();
        await expect(page.locator('.main-content')).toContainText(/Admin|Management|Dashboard|Staff/i);
    });

    test('should access Employee Counselings', async ({ page }) => {
        await page.click('.sidebar a:has-text("Employee Counselings")');
        await expect(page.locator('.main-content')).toBeVisible();
        await expect(page.locator('.main-content')).toContainText(/Counseling|Record|Employee/i);
    });

    test('should access Key Performance Indicators', async ({ page }) => {
        await page.click('.sidebar a:has-text("Key Performance Indicators")');
        await expect(page.locator('.main-content')).toBeVisible();
        await expect(page.locator('.main-content')).toContainText(/KPI|Performance|Metrics|Report/i);
    });

    test('should logout successfully', async ({ page }) => {
        await page.click('button:has-text("Logout")');
        await expect(page.locator('#login-barrier')).toBeVisible();
    });
});

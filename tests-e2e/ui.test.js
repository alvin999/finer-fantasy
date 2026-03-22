import { test, expect } from '@playwright/test';

test.describe('Coffee Appraisal App UI', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the page and title', async ({ page }) => {
        await expect(page).toHaveTitle('WD 值與壓力曲線教學');
    });

    test('should have a visible pressure chart canvas', async ({ page }) => {
        const canvas = page.locator('#pressure-chart');
        await expect(canvas).toBeVisible();
    });

    test('should switch machines when tabs are clicked', async ({ page }) => {
        const vibeTab = page.locator('button:has-text("Vibe Pump")');
        await vibeTab.click();
        await expect(vibeTab).toHaveClass(/active/);
        
        const synessoTab = page.locator('button:has-text("Synesso 變壓")');
        await synessoTab.click();
        await expect(synessoTab).toHaveClass(/active/);
        await expect(page.locator('#panel-synesso')).toBeVisible();
    });
});

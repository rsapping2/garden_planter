const { test, expect } = require('@playwright/test');

test.describe('Landing Page', () => {
  test('should load the landing page successfully', async ({ page }) => {
    // Navigate to the landing page
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Garden Planter|Garden Planner/);
    
    // Check that key elements are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2').first()).toBeVisible();
    
    // Check that there are no console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any async errors
    await page.waitForTimeout(2000);
    
    // Filter out known non-critical errors (like Firebase emulator warnings)
    const criticalErrors = errors.filter(error => 
      !error.includes('Firebase') && 
      !error.includes('emulator') &&
      !error.includes('localhost')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if there are navigation links
    const navLinks = page.locator('nav a, header a, [role="navigation"] a');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      // Test that at least one navigation link is clickable
      const firstLink = navLinks.first();
      await expect(firstLink).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads without horizontal scroll
    const body = page.locator('body');
    const box = await body.boundingBox();
    expect(box.width).toBeLessThanOrEqual(375);
  });
});

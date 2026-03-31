// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Homepage / Main Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('main');
    await page.waitForLoadState('networkidle');
  });

  test('page loads and gallery container is visible', async ({ page }) => {
    await expect(page).toHaveURL(/main/);
    // Main content area is present
    await expect(page.locator('main, [role="main"]')).toBeVisible();
  });

  test('search input is present and accepts text', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('flower');
    await expect(searchInput).toHaveValue('flower');
  });

  test('photo grid loads after scroll', async ({ page }) => {
    // Photos render as span.thumbnail (Angular click handler, no <a> tag)
    // Scroll is not required but gives the grid time to render
    const photoThumbs = page.locator('span.thumbnail');
    await expect(photoThumbs.first()).toBeVisible({ timeout: 15000 });
  });

  // BUG-002: Footer shows "Blog name" placeholder — this test documents a known bug.
  // It will fail until the bug is fixed in the application.
  test('footer does not show "Blog name" placeholder (BUG-002 regression)', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).not.toContainText('Blog name');
  });
});

// @ts-check
const { test, expect } = require('@playwright/test');

// These tests require valid credentials.
// Set TEST_USERNAME and TEST_PASSWORD environment variables before running.
// Example: TEST_USERNAME=user@example.com TEST_PASSWORD=secret npm test

test.describe('Album Management (authenticated)', () => {
  test.skip(
    !process.env.TEST_USERNAME || !process.env.TEST_PASSWORD,
    'Set TEST_USERNAME and TEST_PASSWORD environment variables to run authenticated tests'
  );

  test.beforeEach(async ({ page }) => {
    await page.goto('login');
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder('Enter your email or username').fill(process.env.TEST_USERNAME);
    // Password field has no placeholder — target by type
    await page.locator('input[type="password"]').fill(process.env.TEST_PASSWORD);
    await page.getByRole('button', { name: /login/i }).click();
    // Login redirects to /profile/{id}, not /main
    await page.waitForURL(/profile\//, { timeout: 15000 });
  });

  test('authenticated user can navigate to album management (profile page)', async ({ page }) => {
    // After login we are already on the profile page with album management
    await expect(page).toHaveURL(/profile\//);
    await expect(page.getByRole('button', { name: /create album/i })).toBeVisible();
  });

  test('can create a new album', async ({ page }) => {
    await page.getByRole('button', { name: /create album/i }).click();
    await page.waitForURL(/album\/create/);
    const albumName = 'Test Album ' + Date.now();
    await page.getByRole('textbox', { name: /album name/i }).fill(albumName);
    await page.getByRole('button', { name: /save album/i }).click();
    // After save, stays on /album/ detail page with "Almost done!" heading
    await expect(page.getByRole('heading', { name: /almost done/i })).toBeVisible({ timeout: 10000 });
    // Album name is shown in the heading
    await expect(page.getByRole('heading', { name: new RegExp(albumName) })).toBeVisible();
  });

  test('BUG-007 regression: profile page shows actual username, not generic placeholder', async ({ page }) => {
    // Profile heading should show the real username, not a placeholder like "username"
    const heading = page.getByRole('heading', { level: 2 });
    const headingText = await heading.textContent();
    expect(headingText).not.toMatch(/^username$/i);
    expect(headingText && headingText.trim().length).toBeGreaterThan(0);
  });

  test('BUG-008 regression: album counter uses correct plural form', async ({ page }) => {
    const bodyText = await page.locator('body').textContent();
    // Bug was "1 albums" — should be "1 album" (singular)
    expect(bodyText).not.toMatch(/\b1 albums\b/i);
    // And "2 albums" not "2 album" (plural check)
    expect(bodyText).not.toMatch(/\b2 album\b(?!s)/);
  });
});

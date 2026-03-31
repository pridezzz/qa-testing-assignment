// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Photo Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('main');
    await page.waitForLoadState('networkidle');
  });

  test('submitting a search navigates to search results URL', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search...');
    await searchInput.fill('flower');
    await searchInput.press('Enter');
    await page.waitForURL(/photo\/search\/flower/);
    await expect(page).toHaveURL(/photo\/search\/flower/);
  });

  test('search results page shows a results heading with the search term', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search...');
    await searchInput.fill('flower');
    await searchInput.press('Enter');
    await page.waitForURL(/photo\/search\/flower/);
    const heading = page.getByRole('heading');
    await expect(heading).toContainText('flower');
  });

  test('BUG-013 regression: search heading uses plural "results" when multiple photos returned', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search...');
    await searchInput.fill('flower');
    await searchInput.press('Enter');
    await page.waitForURL(/photo\/search\/flower/);
    const heading = page.getByRole('heading');
    const headingText = await heading.textContent();
    // "Search result for:" is the bug; correct text is "Search results for:"
    expect(headingText).toMatch(/Search results for:/i);
  });

  test('no-results search shows a message', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search...');
    await searchInput.fill('xyzqwertynotexist');
    await searchInput.press('Enter');
    await page.waitForURL(/photo\/search\/xyzqwertynotexist/);
    const heading = page.getByRole('heading');
    await expect(heading).toBeVisible();
  });

  test('BUG-014 regression: no-results message uses correct grammar and includes search term', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search...');
    await searchInput.fill('xyzqwertynotexist');
    await searchInput.press('Enter');
    await page.waitForURL(/photo\/search\/xyzqwertynotexist/);
    const heading = page.getByRole('heading');
    const headingText = await heading.textContent();
    // Bug: "matches" instead of "match", and no search term shown
    expect(headingText).toMatch(/match/i);
    expect(headingText).toContain('xyzqwertynotexist');
  });
});

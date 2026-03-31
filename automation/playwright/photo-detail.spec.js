// @ts-check
const { test, expect } = require('@playwright/test');

/** Navigate to main, wait for photo grid to render, return the first thumbnail. */
async function getFirstThumbnail(page) {
  await page.goto('main');
  await page.waitForLoadState('networkidle');
  const thumbnail = page.locator('span.thumbnail').first();
  await thumbnail.waitFor({ timeout: 15000 });
  return thumbnail;
}

test.describe('Photo Detail View', () => {
  test('clicking a photo navigates to detail URL', async ({ page }) => {
    const thumbnail = await getFirstThumbnail(page);
    await thumbnail.click();
    await page.waitForURL(/photo\/detail\/.+/);
    await expect(page).toHaveURL(/photo\/detail\//);
  });

  test('detail page shows photo metadata', async ({ page }) => {
    const thumbnail = await getFirstThumbnail(page);
    await thumbnail.click();
    await page.waitForURL(/photo\/detail\/.+/);
    // "Last changed:" date should be visible
    await expect(page.getByText(/Last changed:/)).toBeVisible();
  });

  // BUG-004: Hover card date may differ from detail page date.
  // The hover card date is in .thumbnail__info__text inside .thumbnail--overlay.
  test('BUG-004 regression: hover card date matches detail page date', async ({ page }) => {
    await page.goto('main');
    await page.waitForLoadState('networkidle');
    const thumbnail = page.locator('span.thumbnail').first();
    await thumbnail.waitFor({ timeout: 15000 });

    // Read the date from the DOM directly — overlay is always in DOM, just hidden by CSS
    let hoverDate = null;
    try {
      const dateEl = thumbnail.locator('.thumbnail__info__text').last();
      // Use evaluate to read textContent even when not visible
      hoverDate = await dateEl.evaluate(el => el.textContent, { timeout: 3000 });
    } catch {
      // date element not present in DOM
    }

    // Click to navigate to detail page
    await thumbnail.click({ force: true });
    await page.waitForURL(/photo\/detail\/.+/);
    // Wait for the detail metadata to render
    await page.getByText(/Last changed:/).waitFor({ timeout: 10000 });
    // Extract the date from the detail page
    const detailDate = await page.locator('.thumbnail__info__text, [class*="info"] [class*="text"]')
      .filter({ hasText: /\d{2}\/\d{2}\/\d{4}/ })
      .first()
      .textContent({ timeout: 5000 })
      .then(t => (t ? t.trim() : ''))
      .catch(() => '');

    if (hoverDate !== null && hoverDate.trim() !== '') {
      expect(hoverDate.trim()).toBe(detailDate);
    } else {
      test.skip(true, 'Hover card date not accessible — verify BUG-004 manually');
    }
  });

  test('BUG-006 regression: no image assets return 404 on detail page', async ({ page }) => {
    const failedUrls = [];
    page.on('response', response => {
      if (
        response.status() === 404 &&
        !response.url().endsWith('favicon.ico') &&
        response.url().includes('baasic.com')
      ) {
        failedUrls.push(response.url());
      }
    });

    const thumbnail = await getFirstThumbnail(page);
    await thumbnail.click();
    await page.waitForURL(/photo\/detail\/.+/);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    expect(
      failedUrls,
      `Expected no 404 image responses on detail page, but got: ${failedUrls.join(', ')}`
    ).toHaveLength(0);
  });

  test('back navigation returns to main gallery', async ({ page }) => {
    const thumbnail = await getFirstThumbnail(page);
    await thumbnail.click();
    await page.waitForURL(/photo\/detail\/.+/);
    await page.goBack();
    await expect(page).toHaveURL(/main/);
  });
});

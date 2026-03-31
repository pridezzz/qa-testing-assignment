// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const os = require('os');

// These tests require valid credentials.
// Set TEST_USERNAME and TEST_PASSWORD environment variables before running.
// Example: TEST_USERNAME=user@example.com TEST_PASSWORD=secret npm test

test.describe('Photo Upload and Deletion (authenticated)', () => {
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
    // Login redirects to /profile/{id}
    await page.waitForURL(/profile\//, { timeout: 15000 });
  });

  test('authenticated user can navigate to photo upload', async ({ page }) => {
    // Navigate to main gallery to look for upload button (shown when logged in)
    await page.goto('main');
    await page.waitForLoadState('networkidle');
    const uploadButton = page.getByRole('button', { name: /upload|add photo/i });
    if (await uploadButton.isVisible({ timeout: 5000 })) {
      await uploadButton.click();
      await expect(page.locator('input[type="file"]')).toBeAttached({ timeout: 5000 });
    } else {
      test.skip(true, 'Upload button not found on main page when logged in');
    }
  });

  test('BUG-006 regression: uploaded photo does not produce 404 on detail page', async ({ page }) => {
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

    // Create a minimal 1x1 PNG for upload
    const tmpDir = os.tmpdir();
    const tmpFile = path.join(tmpDir, 'test-photo.png');
    // 1x1 red pixel PNG (base64 decoded)
    const pngBytes = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(tmpFile, pngBytes);

    await page.goto('main');
    await page.waitForLoadState('networkidle');
    const uploadButton = page.getByRole('button', { name: /upload|add photo/i });
    if (!(await uploadButton.isVisible({ timeout: 5000 }))) {
      test.skip(true, 'Upload button not found on main page');
    }

    await uploadButton.click();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.waitFor({ timeout: 5000 });
    await fileInput.setInputFiles(tmpFile);
    await page.getByRole('button', { name: /save|upload|confirm/i }).click();
    await page.waitForTimeout(3000);

    // Navigate to the uploaded photo's detail page
    await page.goto('main');
    await page.waitForLoadState('networkidle');
    const firstPhoto = page.locator('span.thumbnail').first();
    await firstPhoto.waitFor({ timeout: 15000 });
    await firstPhoto.click();
    await page.waitForURL(/photo\/detail\/.+/);
    await page.waitForTimeout(2000);

    fs.unlinkSync(tmpFile);

    expect(
      failedUrls,
      `Expected no 404s after upload but got: ${failedUrls.join(', ')}`
    ).toHaveLength(0);
  });

  test('can delete a photo and it disappears from the gallery', async ({ page }) => {
    // Navigate to gallery, open first photo detail
    await page.goto('main');
    await page.waitForLoadState('networkidle');
    const thumbnail = page.locator('span.thumbnail').first();
    await thumbnail.waitFor({ timeout: 15000 });
    await thumbnail.click();
    await page.waitForURL(/photo\/detail\/.+/);
    const deletedUrl = page.url();

    const deleteButton = page.getByRole('button', { name: /delete/i });
    if (!(await deleteButton.isVisible({ timeout: 3000 }))) {
      test.skip(true, 'Delete button not visible — photo may not belong to this user');
    }

    await deleteButton.click();
    // Confirm deletion dialog if present
    const confirmButton = page.getByRole('button', { name: /confirm|yes|ok/i });
    if (await confirmButton.isVisible({ timeout: 2000 })) {
      await confirmButton.click();
    }
    await page.waitForURL(/main/, { timeout: 5000 });

    // Verify navigating to the deleted photo URL no longer shows the photo
    await page.goto(deletedUrl);
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toMatch(/Last changed:/);
  });

  test('BUG-010 regression: deleted photo ID cannot be reused to access old photo', async ({ page }) => {
    // Navigate to a photo detail to capture its URL
    await page.goto('main');
    await page.waitForLoadState('networkidle');
    const thumbnail = page.locator('span.thumbnail').first();
    await thumbnail.waitFor({ timeout: 15000 });
    await thumbnail.click();
    await page.waitForURL(/photo\/detail\/.+/);

    const currentUrl = page.url();
    const deleteButton = page.getByRole('button', { name: /delete/i });
    if (!(await deleteButton.isVisible({ timeout: 3000 }))) {
      test.skip(true, 'Delete button not visible — photo may not belong to this user');
    }

    await deleteButton.click();
    const confirmButton = page.getByRole('button', { name: /confirm|yes|ok/i });
    if (await confirmButton.isVisible({ timeout: 2000 })) {
      await confirmButton.click();
    }
    await page.waitForURL(/main/, { timeout: 5000 });

    // Attempt to navigate back to the deleted photo URL
    await page.goto(currentUrl);
    await page.waitForTimeout(1500);
    // Should show a 404/not-found state, not the old photo content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toMatch(/Last changed:/);
  });
});

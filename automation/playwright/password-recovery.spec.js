// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Password Recovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('passwordRecovery');
    await page.waitForLoadState('networkidle');
  });

  test('password recovery page renders heading and email field', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /password recovery/i })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
  });

  test('RECOVER PASSWORD button is disabled when email field is empty', async ({ page }) => {
    const recoverButton = page.getByRole('button', { name: /recover password/i });
    await expect(recoverButton).toBeDisabled();
  });

  test('RECOVER PASSWORD button becomes enabled when email is entered', async ({ page }) => {
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    const recoverButton = page.getByRole('button', { name: /recover password/i });
    await expect(recoverButton).toBeEnabled();
  });

  test('BUG-011 regression: submitting does not show "[object Object]" as error', async ({ page }) => {
    await page.getByPlaceholder('Enter your email').fill('notregistered@example.com');
    await page.getByRole('button', { name: /recover password/i }).click();
    await page.waitForTimeout(2000);
    const pageText = await page.locator('body').textContent();
    expect(pageText).not.toContain('[object Object]');
  });

  test('BUG-002 regression: footer does not show "Blog name" placeholder on password recovery page', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).not.toContainText('Blog name');
  });
});

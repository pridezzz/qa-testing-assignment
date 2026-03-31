// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('login');
    await page.waitForLoadState('networkidle');
  });

  test('login page renders all required form elements', async ({ page }) => {
    await expect(page.getByPlaceholder('Enter your email or username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  // BUG: The Login button is not disabled when fields are empty.
  // This test documents the bug — it will fail until the app is fixed.
  test('LOGIN button is disabled when fields are empty', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeDisabled();
  });

  test('LOGIN button becomes enabled when credentials are entered', async ({ page }) => {
    await page.getByPlaceholder('Enter your email or username').fill('someone@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeEnabled();
  });

  test('wrong credentials show an error message, not a raw object', async ({ page }) => {
    await page.getByPlaceholder('Enter your email or username').fill('invalid@example.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /login/i }).click();
    // Wait for error response from server
    await page.waitForTimeout(3000);
    const pageText = await page.locator('body').textContent();
    // Must not show raw JS object serialisation
    expect(pageText).not.toContain('[object Object]');
  });

  test('BUG-003 regression: social login buttons do not expose raw error messages', async ({ page }) => {
    const socialButtons = page.locator('button').filter({ hasText: /facebook|twitter|google|github/i });
    const count = await socialButtons.count();
    if (count === 0) {
      test.skip(true, 'No social login buttons found on page');
    }
    await socialButtons.first().click();
    await page.waitForTimeout(2000);
    const pageText = await page.locator('body').textContent();
    expect(pageText).not.toContain('[object Object]');
  });

  // BUG-002: Footer shows "Blog name" placeholder — documents a known bug.
  test('BUG-002 regression: footer does not show "Blog name" placeholder on login page', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).not.toContainText('Blog name');
  });
});

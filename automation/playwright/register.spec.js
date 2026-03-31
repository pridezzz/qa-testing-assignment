// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('register');
  });

  test('registration page renders all required form fields', async ({ page }) => {
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
    // Use nth(0) to target the first password field specifically
    await expect(page.getByLabel('Password', { exact: true }).first()).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
  });

  test('REGISTER button is disabled when fields are empty', async ({ page }) => {
    const registerButton = page.getByRole('button', { name: /register/i });
    await expect(registerButton).toBeDisabled();
  });

  test('REGISTER button becomes enabled when all fields are filled', async ({ page }) => {
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your username').fill('testuser');
    // "Password" label matches both fields — use exact + first to target the main password field
    await page.getByLabel('Password', { exact: true }).first().fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');
    const registerButton = page.getByRole('button', { name: /register/i });
    await expect(registerButton).toBeEnabled();
  });

  test('BUG-015 regression: password mismatch shows error after submit', async ({ page }) => {
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your username').fill('testuser');
    await page.getByLabel('Password', { exact: true }).first().fill('password123');
    await page.getByLabel('Confirm Password').fill('different456');
    // Click REGISTER — mismatch error should appear (even if it only shows on submit)
    await page.getByRole('button', { name: /register/i }).click();
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  // BUG-015: Error should appear on blur, not just on submit.
  // This test documents the bug — it will fail until the bug is fixed.
  test('BUG-015 regression: password mismatch error should appear on blur (not only on submit)', async ({ page }) => {
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your username').fill('testuser');
    await page.getByLabel('Password', { exact: true }).first().fill('password123');
    await page.getByLabel('Confirm Password').fill('different456');
    // Blur the Confirm Password field without submitting
    await page.getByLabel('Confirm Password').blur();
    await page.waitForTimeout(500);
    // This currently FAILS (bug) — error only shows after submit
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  // BUG-002: Footer shows "Blog name" placeholder — documents a known bug.
  test('BUG-002 regression: footer does not show "Blog name" placeholder on register page', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).not.toContainText('Blog name');
  });
});

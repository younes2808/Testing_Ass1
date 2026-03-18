import { test, expect } from '@playwright/test';

test('User can log in, view accounts overview, and log out', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');

  // Log in
  await page.locator('input[name="username"]').fill('john2');
  await page.locator('input[name="password"]').fill('demo');
  await page.getByRole('button', { name: 'Log In' }).click();

  // Check that login error did NOT appear
  await expect(page.getByText('The username and password could not be verified.')).not.toBeVisible();

  // Verify Accounts Overview page
  await expect(
    page.getByRole('heading', { name: 'Accounts Overview' })
  ).toBeVisible();

  // Optional extra check
  await expect(page.getByRole('table')).toBeVisible();

  // Log out
  await page.getByRole('link', { name: 'Log Out' }).click();

  // Verify logout
  await expect(
    page.getByRole('button', { name: 'Log In' })
  ).toBeVisible();
});
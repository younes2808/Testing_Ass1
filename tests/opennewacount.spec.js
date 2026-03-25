import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');

  await page.locator('input[name="username"]').fill('test');
  await page.locator('input[name="password"]').fill('test123');
  await page.getByRole('button', { name: 'Log In' }).click();

  await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
});

test.afterEach(async ({ page }) => {
    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
  });

  test('User creates new account', async ({ page }) => {

    await page.getByRole('link', { name: 'Open New Account' }).click();

    await page.locator('#dropDown').selectOption('SAVINGS')

    await page.getByRole('button', { name: 'OPEN NEW ACCOUNT' }).click();

    // Verify success
    await expect(page.locator('#accountToOpen')).toContainText('Account Opened');

    // Back to overview
    await page.getByRole('link', { name: 'Accounts Overview' }).click();

    await expect(page.getByRole('table')).toBeVisible();



  });

  
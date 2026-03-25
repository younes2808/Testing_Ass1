import { test, expect } from '@playwright/test';

// task 2.7 - runs before every test
test.beforeEach(async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');

  await page.locator('input[name="username"]').fill('test');
  await page.locator('input[name="password"]').fill('test123');
  await page.getByRole('button', { name: 'Log In' }).click();

  await expect(
    page.getByRole('heading', { name: 'Accounts Overview' })
  ).toBeVisible();
});

// task 2.8 - runs after every test
test.afterEach(async ({ page }) => {
  await page.getByRole('link', { name: 'Log Out' }).click();
  await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
});

// Test case 1 (task 2.5) - accounts overview
test('User can view accounts overview', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Accounts Overview' })
  ).toBeVisible();

  await expect(page.getByRole('table')).toBeVisible();
});

// Test case 2 (task 2.6) - bill pay
test('User pays bill using total balance', async ({ page }) => {

  // Get TOTAL balance (last row in table)
  const totalText = await page
    .locator('#accountTable tbody tr:last-child td:nth-child(2) b')
    .innerText();
  const initialTotal = parseFloat(totalText.replace('$', '').replace(/,/g, ''));

  // Go to Bill Pay
  await page.getByRole('link', { name: 'Bill Pay' }).click();

  // Fill form
  await page.locator('input[name="payee.name"]').fill('Test Payee');
  await page.locator('input[name="payee.address.street"]').fill('Street 1');
  await page.locator('input[name="payee.address.city"]').fill('City');
  await page.locator('input[name="payee.address.state"]').fill('State');
  await page.locator('input[name="payee.address.zipCode"]').fill('12345');
  await page.locator('input[name="payee.phoneNumber"]').fill('123456789');

  await page.locator('input[name="payee.accountNumber"]').fill('12345');
  await page.locator('input[name="verifyAccount"]').fill('12345');

  await page.locator('input[name="amount"]').fill('200');

  // Select source account (required field)
  await page.locator('select[name="fromAccountId"]').selectOption({ index: 0 });

  await page.getByRole('button', { name: 'Send Payment' }).click();

  // Verify success
  await expect(page.locator('#billpayResult')).toContainText('Bill Payment');

  // Back to overview
  await page.getByRole('link', { name: 'Accounts Overview' }).click();

  // Get NEW total balance
  const newTotalText = await page
    .locator('#accountTable tbody tr:last-child td:nth-child(2) b')
    .innerText();
  const newTotal = parseFloat(newTotalText.replace('$', '').replace(/,/g, ''));

  // Verify difference
  expect(initialTotal - newTotal).toBeCloseTo(200, 2);
});

// Test case 3 (task 2.9) - open new account
test('User creates new account', async ({ page }) => {
  await page.getByRole('link', { name: 'Open New Account' }).click();

  await page.getByRole('button', { name: 'OPEN NEW ACCOUNT' }).click();

  // Verify success
  await expect(page.locator('#openAccountResult')).toContainText('Account Opened');

  // Back to overview
  await page.getByRole('link', { name: 'Accounts Overview' }).click();

  await expect(page.getByRole('table')).toBeVisible();
});
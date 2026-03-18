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

test('User pays bill using total balance', async ({ page }) => {

  // Get TOTAL balance (last row in table)
  const totalText = await page.locator('#accountTable tbody tr:last-child td:nth-child(2) b').innerText();
  const initialTotal = parseFloat(totalText.replace('$','').replace(',',''));

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

  await page.getByRole('button', { name: 'Send Payment' }).click();

  // Verify success
  await expect(page.locator('#billpayResult')).toContainText('Bill Payment');

  // Back to overview
  await page.getByRole('link', { name: 'Accounts Overview' }).click();

  // Get NEW total balance
  const newTotalText = await page.locator('#accountTable tbody tr:last-child td:nth-child(2) b').innerText();
  const newTotal = parseFloat(newTotalText.replace('$','').replace(',',''));
  // Verify difference
  expect(initialTotal - newTotal).toBeCloseTo(200, 2);
});
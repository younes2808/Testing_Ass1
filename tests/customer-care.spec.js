import { test, expect } from '@playwright/test';

test('User can submit the Customer Care form', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');

  // Go to Customer Care page
  await page.getByRole('link', { name: 'Contact Us' }).click();

  // Verify page loaded
  await expect(
    page.getByRole('heading', { name: /customer care/i })
  ).toBeVisible();

  // Fill the form
  await page.locator('input[name="name"]').fill('John Doe');
  await page.locator('input[name="email"]').fill('john@test.com');
  await page.locator('input[name="phone"]').fill('12345678');
  await page.locator('textarea[name="message"]').fill('This is a test message.');

  // Submit form
  await page.getByRole('button', { name: /send to customer care/i }).click();

  // Verify success
  await expect(
    page.getByText(/a customer care representative will be contacting you/i)
  ).toBeVisible();
});
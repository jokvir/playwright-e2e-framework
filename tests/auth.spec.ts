import { expect, test } from '../src/fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

const protectedPaths = [
  '/inventory.html',
  '/inventory-item.html',
  '/cart.html',
  '/checkout-step-one.html',
  '/checkout-step-two.html',
  '/checkout-complete.html',
];

for (const path of protectedPaths) {
  test(`${path} requires a session`, { tag: '@regression' }, async ({ page, loginPage }) => {
    await page.goto(path);

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.error).toHaveText(
      `Epic sadface: You can only access '${path}' when you are logged in.`,
    );
  });
}

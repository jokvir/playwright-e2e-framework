import { expect, Given, Then, When } from '../fixtures';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When('I sign in as {string}', async ({ loginPage }, username: string) => {
  await loginPage.login(username);
});

When(
  'I sign in with username {string} and password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login(username, password);
  },
);

When('I sign out', async ({ inventoryPage }) => {
  await inventoryPage.header.logout();
});

Then('I see the products page', async ({ page, inventoryPage }) => {
  await expect(page).toHaveURL('/inventory.html');
  await expect(inventoryPage.header.title).toHaveText('Products');
});

Then('I see the login error {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.error).toHaveText(message);
});

Then('I see the login page', async ({ page, loginPage }) => {
  await expect(page).toHaveURL('/');
  await expect(loginPage.loginButton).toBeVisible();
});

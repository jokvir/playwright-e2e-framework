import { expect, test as setup } from '@playwright/test';
import { authFile, personas } from '../src/data/users';
import { LoginPage } from '../src/pages/login-page';

for (const persona of personas) {
  setup(`authenticate as ${persona}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(persona);

    await expect(page).toHaveURL('/inventory.html');
    await page.context().storageState({ path: authFile(persona) });
  });
}

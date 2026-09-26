import { createBdd, test as base } from 'playwright-bdd';
import type { Product } from './data/products';
import { authFile, type Persona } from './data/users';
import { CartPage } from './pages/cart-page';
import { CheckoutCompletePage } from './pages/checkout-complete-page';
import { CheckoutInfoPage } from './pages/checkout-info-page';
import { CheckoutOverviewPage } from './pages/checkout-overview-page';
import { InventoryPage } from './pages/inventory-page';
import { LoginPage } from './pages/login-page';
import { ProductPage } from './pages/product-page';

interface Options {
  persona: Persona;
}

interface Fixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  cartItems: Product[];
}

export const test = base.extend<Options & Fixtures>({
  persona: ['standard_user', { option: true }],
  storageState: async ({ persona }, use, testInfo) => {
    const guest = testInfo.tags.includes('@guest');
    await use(guest ? { cookies: [], origins: [] } : authFile(persona));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
  // eslint-disable-next-line no-empty-pattern -- Playwright requires the destructuring even with no dependencies.
  cartItems: async ({}, use) => {
    await use([]);
  },
});

export const { Given, When, Then } = createBdd(test);

export { expect } from '@playwright/test';

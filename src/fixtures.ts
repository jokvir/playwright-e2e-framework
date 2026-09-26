import { test as base } from '@playwright/test';
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

interface Pages {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
}

export const test = base.extend<Options & Pages>({
  persona: ['standard_user', { option: true }],
  storageState: async ({ persona }, use) => {
    await use(authFile(persona));
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
});

export { expect } from '@playwright/test';

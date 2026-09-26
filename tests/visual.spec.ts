import type { Page } from '@playwright/test';
import { customer } from '../src/data/checkout';
import { products } from '../src/data/products';
import { expect, test } from '../src/fixtures';
import { knownDefect } from '../src/known-defect';

test.skip(
  process.platform !== 'linux',
  'Baselines are rendered in the Linux Playwright image. Run npm run test:visual.',
);

function fullPageWithoutYear(page: Page) {
  return { fullPage: true, mask: [page.getByTestId('footer-copy')] };
}

test('login page', { tag: ['@visual', '@guest'] }, async ({ page, loginPage }) => {
  await loginPage.goto();

  await expect(page).toHaveScreenshot('login.png');
});

test('products page', { tag: '@visual' }, async ({ page, inventoryPage }) => {
  await inventoryPage.goto();

  await expect(page).toHaveScreenshot('products.png', fullPageWithoutYear(page));
});

test('cart with two products', { tag: '@visual' }, async ({ page, inventoryPage, cartPage }) => {
  await inventoryPage.goto();
  await inventoryPage.addToCart(products.backpack.name);
  await inventoryPage.addToCart(products.boltTShirt.name);
  await inventoryPage.header.openCart();
  await expect(cartPage.header.title).toHaveText('Your Cart');

  await expect(page).toHaveScreenshot('cart.png', fullPageWithoutYear(page));
});

test(
  'checkout overview',
  { tag: '@visual' },
  async ({ page, inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.header.openCart();
    await cartPage.checkout();
    await checkoutInfoPage.submit(customer);
    await expect(checkoutOverviewPage.header.title).toHaveText('Checkout: Overview');

    await expect(page).toHaveScreenshot('checkout-overview.png', fullPageWithoutYear(page));
  },
);

test.describe('visual_user', () => {
  test.use({ persona: 'visual_user' });

  test.fail(
    'products page matches the standard layout',
    {
      tag: '@visual',
      annotation: knownDefect(
        'SD-006',
        'cart icon, titles and a button are shifted; Backpack shows the wrong image',
      ),
    },
    async ({ page, inventoryPage }, testInfo) => {
      test.skip(
        ['all', 'changed'].includes(testInfo.config.updateSnapshots),
        'A defective render must never overwrite the standard baseline.',
      );
      await inventoryPage.goto();

      await expect(page).toHaveScreenshot('products.png', fullPageWithoutYear(page));
    },
  );
});

import { customer, orderSummary } from '../src/data/checkout';
import { catalog, formatPrice, products } from '../src/data/products';
import { expect, test } from '../src/fixtures';
import { knownDefect } from '../src/known-defect';

test.describe('standard_user', () => {
  test.fail(
    'item total is rounded to cents',
    {
      tag: '@regression',
      annotation: knownDefect(
        'SD-005',
        'item total shows floating-point digits, e.g. $121.94999999999999',
      ),
    },
    async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
      // The app sums prices as floats in the order they were added; this order hits the drift.
      const items = [
        products.backpack,
        products.bikeLight,
        products.boltTShirt,
        products.redTShirt,
        products.fleeceJacket,
      ];
      await inventoryPage.goto();
      for (const item of items) {
        await inventoryPage.addToCart(item.name);
      }
      await inventoryPage.header.openCart();
      await cartPage.checkout();

      await checkoutInfoPage.submit(customer);

      await expect(checkoutOverviewPage.itemTotal).toHaveText(
        `Item total: ${formatPrice(orderSummary(items).itemTotal)}`,
      );
    },
  );
});

test.describe('problem_user', () => {
  test.use({ persona: 'problem_user' });

  test.fail(
    'every product shows its own image',
    {
      tag: '@regression',
      annotation: knownDefect('SD-001', 'all products show the same placeholder image'),
    },
    async ({ inventoryPage }) => {
      await inventoryPage.goto();
      await expect(inventoryPage.itemImages).toHaveCount(catalog.length);

      const sources = await inventoryPage.itemImages.evaluateAll((images) =>
        images.map((image) => image.getAttribute('src')),
      );

      expect(new Set(sources).size).toBe(catalog.length);
    },
  );

  test.fail(
    'shipping details can be submitted',
    {
      tag: '@regression',
      annotation: knownDefect(
        'SD-002',
        'typing in Last Name overwrites First Name, so checkout is blocked',
      ),
    },
    async ({ page, checkoutInfoPage }) => {
      await checkoutInfoPage.goto();

      await checkoutInfoPage.submit(customer);

      await expect(page).toHaveURL('/checkout-step-two.html');
    },
  );
});

test.describe('error_user', () => {
  test.use({ persona: 'error_user' });

  test.fail(
    'an order can be finished',
    {
      tag: '@regression',
      annotation: knownDefect(
        'SD-003',
        'Finish throws a JavaScript error and the order is never placed',
      ),
    },
    async ({
      inventoryPage,
      cartPage,
      checkoutInfoPage,
      checkoutOverviewPage,
      checkoutCompletePage,
    }) => {
      await inventoryPage.goto();
      await inventoryPage.addToCart(products.backpack.name);
      await inventoryPage.header.openCart();
      await cartPage.checkout();
      await checkoutInfoPage.submit(customer);

      await checkoutOverviewPage.finish();

      await expect(checkoutCompletePage.confirmation).toHaveText('Thank you for your order!');
    },
  );
});

test.describe('visual_user', () => {
  test.use({ persona: 'visual_user' });

  test.fail(
    'product prices match the catalog',
    {
      tag: '@regression',
      annotation: knownDefect('SD-004', 'prices on the products page are random on every load'),
    },
    async ({ inventoryPage }) => {
      await inventoryPage.goto();

      await expect(inventoryPage.itemPrices).toHaveText(
        catalog.map((product) => formatPrice(product.price)),
      );
    },
  );
});

import { catalog, formatPrice, products } from '../src/data/products';
import { expect, test } from '../src/fixtures';
import type { SortOrder } from '../src/pages/inventory-page';

const names = catalog.map((product) => product.name).toSorted((a, b) => a.localeCompare(b));
const prices = catalog
  .map((product) => product.price)
  .toSorted((a, b) => a - b)
  .map(formatPrice);

const sortCases: { order: SortOrder; column: 'itemNames' | 'itemPrices'; expected: string[] }[] = [
  { order: 'Name (A to Z)', column: 'itemNames', expected: names },
  { order: 'Name (Z to A)', column: 'itemNames', expected: names.toReversed() },
  { order: 'Price (low to high)', column: 'itemPrices', expected: prices },
  { order: 'Price (high to low)', column: 'itemPrices', expected: prices.toReversed() },
];

test.beforeEach(async ({ inventoryPage }) => {
  await inventoryPage.goto();
});

for (const { order, column, expected } of sortCases) {
  test(`sorts products by ${order}`, { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy(order);

    await expect(inventoryPage[column]).toHaveText(expected);
  });
}

for (const product of catalog) {
  test(
    `shows the details of ${product.name}`,
    { tag: '@regression' },
    async ({ page, inventoryPage, productPage }) => {
      await inventoryPage.openProduct(product.name);

      await expect(page).toHaveURL(`/inventory-item.html?id=${String(product.id)}`);
      await expect(productPage.name).toHaveText(product.name);
      await expect(productPage.description).toHaveText(product.description);
      await expect(productPage.price).toHaveText(formatPrice(product.price));
    },
  );
}

test(
  'adding and removing products updates the cart badge',
  { tag: '@smoke' },
  async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.onesie.name);
    await expect(inventoryPage.header.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(products.backpack.name);

    await expect(inventoryPage.header.cartBadge).toHaveText('1');
    await expect(
      inventoryPage.item(products.backpack.name).getByRole('button', { name: 'Add to cart' }),
    ).toBeVisible();
  },
);

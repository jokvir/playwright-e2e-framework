import { products } from '../src/data/products';
import { expect, test } from '../src/fixtures';

test('login page', { tag: ['@a11y', '@guest'] }, async ({ loginPage, scanAccessibility }) => {
  await loginPage.goto();

  expect(await scanAccessibility()).toEqual([]);
});

test(
  'login page with an error',
  { tag: ['@a11y', '@guest'] },
  async ({ loginPage, scanAccessibility }) => {
    await loginPage.goto();
    await loginPage.login('', '');
    await expect(loginPage.error).toBeVisible();

    expect(await scanAccessibility()).toEqual([]);
  },
);

test('products page', { tag: '@a11y' }, async ({ inventoryPage, scanAccessibility }) => {
  await inventoryPage.goto();
  await expect(inventoryPage.itemNames.first()).toBeVisible();

  expect(await scanAccessibility()).toEqual([]);
});

test('cart page', { tag: '@a11y' }, async ({ inventoryPage, cartPage, scanAccessibility }) => {
  await inventoryPage.goto();
  await inventoryPage.addToCart(products.backpack.name);
  await inventoryPage.header.openCart();
  await expect(cartPage.header.title).toHaveText('Your Cart');

  expect(await scanAccessibility()).toEqual([]);
});

test(
  'shipping details with an error',
  { tag: '@a11y' },
  async ({ checkoutInfoPage, scanAccessibility }) => {
    await checkoutInfoPage.goto();
    await checkoutInfoPage.submit({ firstName: '', lastName: '', postalCode: '' });
    await expect(checkoutInfoPage.error).toBeVisible();

    expect(await scanAccessibility()).toEqual([]);
  },
);

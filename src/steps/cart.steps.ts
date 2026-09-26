import type { DataTable } from 'playwright-bdd';
import { formatPrice, productNamed } from '../data/products';
import { expect, Given, Then, When } from '../fixtures';

Given('I am on the products page', async ({ inventoryPage }) => {
  await inventoryPage.goto();
});

When('I add {string} to the cart', async ({ inventoryPage, cartItems }, name: string) => {
  await inventoryPage.addToCart(name);
  cartItems.push(productNamed(name));
});

When('I open the cart', async ({ inventoryPage, cartPage }) => {
  await inventoryPage.header.openCart();
  await expect(cartPage.header.title).toHaveText('Your Cart');
});

When('I remove {string} from the cart', async ({ cartPage }, name: string) => {
  await cartPage.remove(name);
});

Then('the cart lists:', async ({ cartPage }, table: DataTable) => {
  const listed = table.raw().flat().map(productNamed);

  await expect(cartPage.itemNames).toHaveText(listed.map((product) => product.name));
  await expect(cartPage.itemPrices).toHaveText(listed.map((product) => formatPrice(product.price)));
});

Then('the cart badge shows {string}', async ({ cartPage }, count: string) => {
  await expect(cartPage.header.cartBadge).toHaveText(count);
});

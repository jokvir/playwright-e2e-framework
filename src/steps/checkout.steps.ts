import { customer, orderSummary, type Customer } from '../data/checkout';
import { formatPrice } from '../data/products';
import { expect, Then, When } from '../fixtures';

const fieldKeys = {
  'first name': 'firstName',
  'last name': 'lastName',
  'postal code': 'postalCode',
} satisfies Record<string, keyof Customer>;

When('I start the checkout', async ({ cartPage, checkoutInfoPage }) => {
  await cartPage.checkout();
  await expect(checkoutInfoPage.header.title).toHaveText('Checkout: Your Information');
});

When('I enter my shipping details', async ({ checkoutInfoPage }) => {
  await checkoutInfoPage.submit(customer);
});

When(
  /^I submit my shipping details without the (first name|last name|postal code)$/,
  async ({ checkoutInfoPage }, field: keyof typeof fieldKeys) => {
    await checkoutInfoPage.submit({ ...customer, [fieldKeys[field]]: '' });
  },
);

When('I finish the order', async ({ checkoutOverviewPage }) => {
  await checkoutOverviewPage.finish();
});

Then('I see the order confirmation {string}', async ({ checkoutCompletePage }, message: string) => {
  await expect(checkoutCompletePage.confirmation).toHaveText(message);
});

Then(
  'the item total, tax and total match the cart items',
  async ({ checkoutOverviewPage, cartItems }) => {
    const expected = orderSummary(cartItems);

    await expect(checkoutOverviewPage.itemNames).toHaveText(cartItems.map((item) => item.name));
    await expect(checkoutOverviewPage.itemTotal).toHaveText(
      `Item total: ${formatPrice(expected.itemTotal)}`,
    );
    await expect(checkoutOverviewPage.tax).toHaveText(`Tax: ${formatPrice(expected.tax)}`);
    await expect(checkoutOverviewPage.total).toHaveText(`Total: ${formatPrice(expected.total)}`);
  },
);

Then('I see the checkout error {string}', async ({ checkoutInfoPage }, message: string) => {
  await expect(checkoutInfoPage.error).toHaveText(message);
});

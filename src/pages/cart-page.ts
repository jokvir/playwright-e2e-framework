import type { Locator, Page } from '@playwright/test';
import { step } from '../step';
import { BasePage } from './base-page';
import { Header } from './header';

export class CartPage extends BasePage {
  protected readonly path = '/cart.html';
  readonly header: Header;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  private readonly items: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.checkoutButton = page.getByTestId('checkout');
  }

  @step
  async remove(name: string): Promise<void> {
    await this.items
      .filter({ has: this.page.getByText(name, { exact: true }) })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  @step
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

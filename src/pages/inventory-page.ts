import type { Locator, Page } from '@playwright/test';
import { step } from '../step';
import { BasePage } from './base-page';
import { Header } from './header';

export type SortOrder =
  'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';
  readonly header: Header;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemImages: Locator;
  private readonly items: Locator;
  private readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.itemImages = this.items.getByRole('img');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  item(name: string): Locator {
    return this.items.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  @step
  async addToCart(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  @step
  async removeFromCart(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  @step
  async sortBy(order: SortOrder): Promise<void> {
    await this.sortSelect.selectOption({ label: order });
  }

  @step
  async openProduct(name: string): Promise<void> {
    await this.itemNames.getByText(name, { exact: true }).click();
  }
}

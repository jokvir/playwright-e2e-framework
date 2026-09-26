import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { Header } from './header';

export class ProductPage extends BasePage {
  protected readonly path = '/inventory-item.html';
  readonly header: Header;
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.name = page.getByTestId('inventory-item-name');
    this.description = page.getByTestId('inventory-item-desc');
    this.price = page.getByTestId('inventory-item-price');
  }
}

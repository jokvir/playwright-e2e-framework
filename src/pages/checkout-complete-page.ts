import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { Header } from './header';

export class CheckoutCompletePage extends BasePage {
  protected readonly path = '/checkout-complete.html';
  readonly header: Header;
  readonly confirmation: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.confirmation = page.getByTestId('complete-header');
  }
}

import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class CheckoutCompletePage extends BasePage {
  protected readonly path = '/checkout-complete.html';
  readonly confirmation: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmation = page.getByTestId('complete-header');
  }
}

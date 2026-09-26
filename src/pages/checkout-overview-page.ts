import type { Locator, Page } from '@playwright/test';
import { step } from '../step';
import { BasePage } from './base-page';
import { Header } from './header';

export class CheckoutOverviewPage extends BasePage {
  protected readonly path = '/checkout-step-two.html';
  readonly header: Header;
  readonly itemNames: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  private readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemTotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }

  @step
  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}

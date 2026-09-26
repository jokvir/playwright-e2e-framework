import type { Locator, Page } from '@playwright/test';
import { step } from '../step';

export class Header {
  readonly title: Locator;
  readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  @step
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  @step
  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}

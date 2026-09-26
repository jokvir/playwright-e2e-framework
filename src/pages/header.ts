import { expect, type Locator, type Page } from '@playwright/test';
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
    this.logoutLink = page.getByRole('button', { name: 'Logout' });
  }

  @step
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  @step
  async logout(): Promise<void> {
    // The burger menu re-mounts right after the page renders, which can swallow the open click
    // or close the menu again, so the whole open-then-click gesture is retried.
    await expect(async () => {
      await this.menuButton.click({ timeout: 2_000 });
      await this.logoutLink.click({ timeout: 2_000 });
    }).toPass();
  }
}

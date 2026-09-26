import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }
}

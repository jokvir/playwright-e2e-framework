import type { Locator, Page } from '@playwright/test';
import { password as defaultPassword } from '../data/users';
import { step } from '../step';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  protected readonly path = '/';
  readonly loginButton: Locator;
  readonly error: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;

  constructor(page: Page) {
    super(page);
    this.loginButton = page.getByTestId('login-button');
    this.error = page.getByTestId('error');
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
  }

  @step
  async login(username: string, password = defaultPassword): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

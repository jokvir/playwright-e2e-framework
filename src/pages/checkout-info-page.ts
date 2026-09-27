import type { Locator, Page } from '@playwright/test';
import type { Customer } from '../data/checkout';
import { step } from '../step';
import { BasePage } from './base-page';
import { Header } from './header';

export class CheckoutInfoPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';
  readonly header: Header;
  readonly error: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.error = page.getByTestId('error');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
  }

  @step
  async submit({ firstName, lastName, postalCode }: Customer): Promise<void> {
    if (firstName) await this.firstNameInput.fill(firstName);
    if (lastName) await this.lastNameInput.fill(lastName);
    if (postalCode) await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }
}

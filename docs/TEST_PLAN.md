# Test plan: Sauce Demo end-to-end

## Scope

In scope, on https://www.saucedemo.com:

- Authentication: sign-in, sign-out, error messages, session guard on protected pages.
- Products page: sorting, product details, adding and removing items.
- Cart and checkout: cart content, shipping form validation, order summary, order confirmation.
- Persona behaviour: problem_user, error_user and visual_user defects.
- Visual layout of the login, products, cart and checkout overview pages.
- Accessibility of five page states against WCAG 2.1 A and AA.

Out of scope:

- Performance and load. Sauce Demo is a third-party public demo, and performance_glitch_user is not exercised.
- Back-end and API. The app runs entirely in the browser and has no API to test.
- The side menu links other than logout, the social links and the "About" page.
- Payment and shipping, which are static text in the demo.

## Approach

| Level             | Technique                                                            | Tool               |
| ----------------- | -------------------------------------------------------------------- | ------------------ |
| Business flows    | Acceptance scenarios in Gherkin, including scenario outlines         | playwright-bdd     |
| Functional checks | Data-driven specs generated from typed data                          | Playwright Test    |
| Defect tracking   | Expected failures with `test.fail()` and a `known-defect` annotation | Playwright Test    |
| Visual            | Full-page screenshot comparison with the copyright year masked       | `toHaveScreenshot` |
| Accessibility     | Automated WCAG 2.1 AA rules, manual review list for undecided rules  | axe-core           |

Expected values come from the test data, never from the page under test. Sort orders are computed from the catalog, and order totals are summed in cents from the catalog prices with the 8% tax rule.

Each test gets a fresh browser context. Sessions are created once per run by the setup project and loaded through `storageState`. The cart lives in the browser's local storage, so tests cannot share state.

## Environments

| Project       | Device          | Runs                                          |
| ------------- | --------------- | --------------------------------------------- |
| chromium      | Desktop Chrome  | All tests, including visual and accessibility |
| firefox       | Desktop Firefox | Functional tests                              |
| webkit        | Desktop Safari  | Functional tests                              |
| mobile-chrome | Pixel 7         | Functional tests                              |

In CI, every project runs in `mcr.microsoft.com/playwright:v1.63.0-noble`. Visual baselines are rendered in the same image.

## Test data

- `src/data/users.ts`: personas, with the password read from `SAUCE_PASSWORD`.
- `src/data/products.ts`: the six catalog items with id, name, description and price.
- `src/data/checkout.ts`: a fictional customer and the order summary rule.

## Risks

| Risk                                                  | Impact                           | Mitigation                                                                          |
| ----------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| The public demo changes its content or markup         | False failures                   | Locators use `data-test` ids and accessible roles; catalog data lives in one file   |
| The demo is slow or unavailable                       | Red builds unrelated to code     | Two retries in CI, reported as flaky; failures keep trace, video and screenshot     |
| UI transitions in the single-page app                 | Flaky interactions               | Navigation steps assert the destination page before acting                          |
| Visual differences between operating systems          | False visual failures            | Baselines rendered only in the Linux Playwright image; skipped elsewhere            |
| A defective render overwrites a baseline              | Visual regressions go unnoticed  | The visual_user test is skipped during baseline updates; CI never writes baselines  |
| `test.fail()` passes on an unrelated error            | A broken defect test looks green | Each defect test was checked without the marker to confirm where it fails           |
| Automated accessibility rules cover only part of WCAG | False sense of compliance        | Undecided rules are flagged for manual review; manual keyboard checks remain needed |
| Too much traffic on a site we do not own              | Unfair load on the demo          | Smoke only on push, 4 workers, no load testing                                      |

## Entry criteria

- Lint and type-check pass.
- Sauce Demo answers on its base URL.
- The setup project creates a session for every persona.

## Exit criteria

- Every test passes, or fails only as a documented known defect.
- No new WCAG 2.1 AA violation.
- No unexpected visual difference.
- Any flaky test is investigated before the change is merged.

## Traceability

| Feature         | Scenarios                                                                  | Tags                   | File                          |
| --------------- | -------------------------------------------------------------------------- | ---------------------- | ----------------------------- |
| Sign-in         | Standard user signs in                                                     | `@smoke` `@guest`      | `features/login.feature`      |
| Sign-in         | Locked-out user is rejected                                                | `@regression` `@guest` | `features/login.feature`      |
| Sign-in         | Refused with a wrong password, an unknown user, no username, no password   | `@regression` `@guest` | `features/login.feature`      |
| Sign-out        | Signed-in user signs out                                                   | `@smoke` `@guest`      | `features/login.feature`      |
| Session guard   | Six protected pages require a session                                      | `@regression` `@guest` | `tests/auth.spec.ts`          |
| Sorting         | Name A to Z, Z to A, price low to high, high to low                        | `@regression`          | `tests/inventory.spec.ts`     |
| Product details | Details of each of the six products match the catalog                      | `@regression`          | `tests/inventory.spec.ts`     |
| Add to cart     | Adding and removing products updates the cart badge                        | `@smoke`               | `tests/inventory.spec.ts`     |
| Cart            | Added products are listed with their prices                                | `@smoke`               | `features/cart.feature`       |
| Cart            | Removing a product from the cart                                           | `@regression`          | `features/cart.feature`       |
| Checkout        | Customer completes a purchase                                              | `@smoke`               | `features/checkout.feature`   |
| Checkout        | Order summary is computed from the item prices                             | `@regression`          | `features/checkout.feature`   |
| Checkout        | Shipping details require the first name, last name, postal code            | `@regression`          | `features/checkout.feature`   |
| Known defects   | SD-001 to SD-005                                                           | `@regression`          | `tests/known-defects.spec.ts` |
| Visual          | Login, products, cart, checkout overview; SD-006 for visual_user           | `@visual`              | `tests/visual.spec.ts`        |
| Accessibility   | Login, login with an error, products, cart, shipping details with an error | `@a11y`                | `tests/a11y.spec.ts`          |

The known defects are described in the [README](../README.md#known-defects).

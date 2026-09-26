Feature: Shopping cart
  As a signed-in customer
  I want to keep the products I pick in a cart
  So that I can review them before I pay

  Background:
    Given I am on the products page

  @smoke
  Scenario: Added products are listed with their prices
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bolt T-Shirt" to the cart
    And I open the cart
    Then the cart lists:
      | Sauce Labs Backpack     |
      | Sauce Labs Bolt T-Shirt |

  @regression
  Scenario: Removing a product from the cart
    Given I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Onesie" to the cart
    And I open the cart
    When I remove "Sauce Labs Backpack" from the cart
    Then the cart lists:
      | Sauce Labs Onesie |
    And the cart badge shows "1"

Feature: Checkout
  As a customer with products in my cart
  I want to pay for my order
  So that it gets shipped to me

  Background:
    Given I am on the products page
    And I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Fleece Jacket" to the cart
    And I open the cart
    And I start the checkout

  @smoke
  Scenario: Customer completes a purchase
    When I enter my shipping details
    And I finish the order
    Then I see the order confirmation "Thank you for your order!"

  @regression
  Scenario: Order summary is computed from the item prices
    When I enter my shipping details
    Then the item total, tax and total match the cart items

  @regression
  Scenario Outline: Shipping details require the <field>
    When I submit my shipping details without the <field>
    Then I see the checkout error "Error: <label> is required"

    Examples:
      | field       | label       |
      | first name  | First Name  |
      | last name   | Last Name   |
      | postal code | Postal Code |

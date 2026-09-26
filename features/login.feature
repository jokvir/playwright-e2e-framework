@guest
Feature: Login
  As a Swag Labs customer
  I want to sign in with my account
  So that only I can shop with it

  Background:
    Given I am on the login page

  @smoke
  Scenario: Standard user signs in
    When I sign in as "standard_user"
    Then I see the products page

  @regression
  Scenario: Locked-out user is rejected
    When I sign in as "locked_out_user"
    Then I see the login error "Epic sadface: Sorry, this user has been locked out."

  @regression
  Scenario Outline: Sign-in is refused with <case>
    When I sign in with username "<username>" and password "<password>"
    Then I see the login error "<error>"

    Examples:
      | case             | username      | password     | error                                                                     |
      | a wrong password | standard_user | wrong_sauce  | Epic sadface: Username and password do not match any user in this service |
      | an unknown user  | unknown_user  | secret_sauce | Epic sadface: Username and password do not match any user in this service |
      | no username      |               | secret_sauce | Epic sadface: Username is required                                        |
      | no password      | standard_user |              | Epic sadface: Password is required                                        |

  @smoke
  Scenario: Signed-in user signs out
    Given I sign in as "standard_user"
    When I sign out
    Then I see the login page

Feature: Shopping Cart Functionality
  As a customer of OctoCAT Supply Chain
  I want to add products to my cart and see a cart icon with item count
  So that I can keep track of my selected items and access my cart easily

  Background:
    Given I am on the OctoCAT Supply Chain website
    And I am viewing the Products page

  Scenario: Adding a product to an empty cart
    Given my shopping cart is empty
    When I select a quantity of 2 for "Laser Level"
    And I click the "Add to Cart" button
    Then the cart icon should display a count of 2
    And the item should be added to my cart

  Scenario: Viewing the cart contents
    Given I have added 2 "Laser Level" products to my cart
    When I click on the cart icon in the navigation bar
    Then I should be taken to the cart page
    And I should see 2 "Laser Level" products in my cart
    And I should see the correct unit price
    And I should see the correct total price for that item

  Scenario: Updating product quantity in the cart
    Given I have added 2 "Laser Level" products to my cart
    And I am viewing the cart page
    When I change the quantity to 3
    Then the item quantity should be updated to 3
    And the cart icon should display a count of 3
    And the total price should be recalculated correctly

  Scenario: Removing a product from the cart
    Given I have added 2 "Laser Level" products to my cart
    And I am viewing the cart page
    When I click the remove button for the "Laser Level" product
    Then the "Laser Level" product should be removed from my cart
    And the cart icon should display a count of 0
    And I should see a message saying "Your cart is empty."

  Scenario: Adding multiple different products to the cart
    Given my shopping cart is empty
    When I select a quantity of 2 for "Laser Level"
    And I click the "Add to Cart" button
    And I select a quantity of 1 for "Smart Tape Measure"
    And I click the "Add to Cart" button
    Then the cart icon should display a count of 3
    And when I view the cart page, I should see both products listed
    And the grand total should reflect all items in the cart

  Scenario: Cart icon displays correct count with multiple products
    Given I have added 2 "Laser Level" products to my cart
    And I have added 1 "Smart Tape Measure" product to my cart
    Then the cart icon should display a count of 3

  Scenario: Viewing order summary on cart page
    Given I have added 2 "Laser Level" products to my cart at $49.99 each
    When I am viewing the cart page
    Then I should see a subtotal of $99.98
    And I should see a 5% discount applied
    And I should see shipping costs added
    And I should see the correct grand total

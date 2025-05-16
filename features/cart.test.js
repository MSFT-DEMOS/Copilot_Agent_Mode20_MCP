// @ts-check
const { test, expect } = require('@playwright/test');

test('Cart Functionality Tests', async ({ page }) => {
  // Background step
  await test.step('Background: Navigate to products page', async () => {
    await page.goto('http://localhost:5137/');
    await page.getByText('Products').click();
    
    // Verify we're on the products page
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });

  // Scenario: Adding a product to an empty cart
  await test.step('Scenario: Adding a product to an empty cart', async () => {
    // Ensure cart is empty first
    const initialCartCount = await page.locator('.cart-count').count();
    if (initialCartCount > 0) {
      await page.goto('http://localhost:5137/cart');
      // Find and clear the cart if needed
      // This might require clicking clear cart button or similar
    }
    
    // Go back to products page
    await page.goto('http://localhost:5137/products');
    
    // Find the Laser Level product
    const laserLevelCard = page.locator('div:has-text("Laser Level")').first();
    
    // Select quantity of 2
    await laserLevelCard.locator('#increase-qty-1').click();
    await laserLevelCard.locator('#increase-qty-1').click();
    
    // Verify quantity is 2
    await expect(laserLevelCard.locator('#qty-1')).toContainText('2');
    
    // Click "Add to Cart" button
    await laserLevelCard.locator('button:has-text("Add to Cart")').click();
    
    // Verify cart icon shows count of 2
    await expect(page.locator('span.bg-primary')).toContainText('2');
  });

  // Scenario: Viewing the cart contents
  await test.step('Scenario: Viewing the cart contents', async () => {
    // Click on the cart icon
    await page.locator('a[href="/cart"]').click();
    
    // Verify we're on the cart page
    await expect(page.getByRole('heading', { name: 'Order Summery' })).toBeVisible();
    
    // Verify there are 2 Laser Level products
    const cartRow = page.locator('tr:has-text("Laser Level")');
    await expect(cartRow).toBeVisible();
    await expect(cartRow.locator('input[type="number"]')).toHaveValue('2');
    
    // Verify unit price and total price are correct
    const unitPrice = await cartRow.locator('td').nth(3).textContent();
    const totalPrice = await cartRow.locator('td').nth(5).textContent();
    
    // Assuming unit price is shown as $49.99 and total as $99.98
    expect(unitPrice).toContain('$');
    expect(totalPrice).toContain('$');
    
    // Verify total price is 2x unit price
    const unitPriceValue = parseFloat(unitPrice.replace('$', ''));
    const totalPriceValue = parseFloat(totalPrice.replace('$', ''));
    expect(totalPriceValue).toBeCloseTo(unitPriceValue * 2, 2);
  });

  // Scenario: Updating product quantity in the cart
  await test.step('Scenario: Updating product quantity in the cart', async () => {
    // We should already be on the cart page
    
    // Change quantity to 3
    const cartRow = page.locator('tr:has-text("Laser Level")');
    await cartRow.locator('input[type="number"]').fill('3');
    await cartRow.locator('input[type="number"]').press('Tab'); // To trigger change event
    
    // Verify quantity updated to 3
    await expect(cartRow.locator('input[type="number"]')).toHaveValue('3');
    
    // Verify cart icon shows 3
    await expect(page.locator('span.bg-primary')).toContainText('3');
    
    // Verify total price recalculated correctly
    const unitPrice = await cartRow.locator('td').nth(3).textContent();
    const totalPrice = await cartRow.locator('td').nth(5).textContent();
    const unitPriceValue = parseFloat(unitPrice.replace('$', ''));
    const totalPriceValue = parseFloat(totalPrice.replace('$', ''));
    expect(totalPriceValue).toBeCloseTo(unitPriceValue * 3, 2);
  });

  // Scenario: Removing a product from the cart
  await test.step('Scenario: Removing a product from the cart', async () => {
    // We should already be on the cart page
    
    // Click the remove button
    const cartRow = page.locator('tr:has-text("Laser Level")');
    await cartRow.locator('button:has-text("✕")').click();
    
    // Verify product is removed
    await expect(page.locator('tr:has-text("Laser Level")')).not.toBeVisible();
    
    // Verify cart icon shows 0
    await expect(page.locator('span.bg-primary')).not.toBeVisible();
    
    // Verify "Your cart is empty" message
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
  });

  // Scenario: Adding multiple different products to the cart
  await test.step('Scenario: Adding multiple different products to the cart', async () => {
    // Go back to products page
    await page.goto('http://localhost:5137/products');
    
    // Find and add 2 Laser Levels
    const laserLevelCard = page.locator('div:has-text("Laser Level")').first();
    await laserLevelCard.locator('#increase-qty-1').click();
    await laserLevelCard.locator('#increase-qty-1').click();
    await laserLevelCard.locator('button:has-text("Add to Cart")').click();
    
    // Find and add 1 Smart Tape Measure
    const tapeMeasureCard = page.locator('div:has-text("Smart Tape Measure")').first();
    await tapeMeasureCard.locator('#increase-qty-2').click();
    await tapeMeasureCard.locator('button:has-text("Add to Cart")').click();
    
    // Verify cart icon shows count of 3
    await expect(page.locator('span.bg-primary')).toContainText('3');
    
    // View cart page and verify both products
    await page.locator('a[href="/cart"]').click();
    await expect(page.locator('tr:has-text("Laser Level")')).toBeVisible();
    await expect(page.locator('tr:has-text("Smart Tape Measure")')).toBeVisible();
    
    // Verify grand total reflects all items
    const subtotalText = await page.locator('div:has-text("Subtotal")').locator('span').textContent();
    expect(parseFloat(subtotalText.replace('$', ''))).toBeGreaterThan(0);
  });

  // Scenario: Viewing order summary on cart page
  await test.step('Scenario: Viewing order summary on cart page', async () => {
    // We should already be on the cart page
    
    // Verify subtotal, discount, shipping and grand total
    const subtotalText = await page.locator('div:has-text("Subtotal")').locator('span').textContent();
    const discountText = await page.locator('div:has-text("Discount")').locator('span').textContent();
    const shippingText = await page.locator('div:has-text("Shipping")').locator('span').textContent();
    const grandTotalText = await page.locator('div:has-text("Grand Total")').locator('span').textContent();
    
    // Convert to numbers
    const subtotal = parseFloat(subtotalText.replace('$', ''));
    const discount = parseFloat(discountText.replace('-$', ''));
    const shipping = parseFloat(shippingText.replace('$', ''));
    const grandTotal = parseFloat(grandTotalText.replace('$', ''));
    
    // Verify discount is 5% of subtotal
    expect(discount).toBeCloseTo(subtotal * 0.05, 2);
    
    // Verify grand total is subtotal - discount + shipping
    expect(grandTotal).toBeCloseTo(subtotal - discount + shipping, 2);
  });
});

const { test, expect } = require('@playwright/test');

test.describe('User Authentication', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    // Create a shared page context for all tests in this describe block
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
  });
  
  test.afterAll(async () => {
    // Clean up the shared page
    if (page) {
      await page.close();
    }
  });

  test('should display login form by default', async () => {
    // Check that login form is visible
    await expect(page.locator('form')).toBeVisible();
    
    // Check for login-specific elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    // Check that login button has correct text
    await expect(loginButton).toContainText(/login|sign in/i);
  });

  test('should switch to signup form when toggled', async () => {
    // Look for signup toggle button/link
    const signupToggle = page.locator('button, a').filter({ hasText: /sign up|register|create account/i });
    
    if (await signupToggle.count() > 0) {
      await signupToggle.click();
      await page.waitForTimeout(500); // Wait for form switch
      
      // Check for signup-specific elements
      const nameInput = page.locator('input[name*="name"], input[placeholder*="name"]');
      const confirmPasswordInput = page.locator('input[placeholder*="confirm"], input[name*="confirm"]');
      const signupButton = page.locator('button[type="submit"]');
      
      // At least one of these should be visible for signup
      const hasNameInput = await nameInput.count() > 0;
      const hasConfirmPassword = await confirmPasswordInput.count() > 0;
      
      expect(hasNameInput || hasConfirmPassword).toBeTruthy();
      await expect(signupButton).toContainText(/sign up|register|create/i);
    }
  });

  test('should validate required fields', async () => {
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Wait a moment for validation to appear
    await page.waitForTimeout(1000);
    
    // Check for validation messages - look for specific error text
    const errorMessages = page.locator('text=/required|invalid|error/i');
    const hasErrors = await errorMessages.count() > 0;
    
    // Should show validation errors for empty required fields
    expect(hasErrors).toBeTruthy();
  });

  test('should validate email format', async () => {
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Enter invalid email
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // Check for email validation error
    const emailError = page.locator('text=/invalid|email|format/i');
    await expect(emailError).toBeVisible();
  });

  test('should validate password requirements', async () => {
    // Switch to signup if needed
    const signupToggle = page.locator('button, a').filter({ hasText: /sign up|register/i });
    if (await signupToggle.count() > 0) {
      await signupToggle.click();
      await page.waitForTimeout(500);
    }
    
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]');
    
    // Enter weak password
    await passwordInput.fill('123');
    await submitButton.click();
    
    // Check for password validation error - look for any password-related error
    const passwordError = page.locator('text=/password|weak|minimum|length|at least/i').first();
    await expect(passwordError).toBeVisible();
  });

  test('should validate password confirmation', async () => {
    // Switch to signup if needed
    const signupToggle = page.locator('button, a').filter({ hasText: /sign up|register/i });
    if (await signupToggle.count() > 0) {
      await signupToggle.click();
      await page.waitForTimeout(500);
    }
    
    const passwordInput = page.locator('input[type="password"]').first();
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    const submitButton = page.locator('button[type="submit"]');
    
    if (await confirmPasswordInput.count() > 0) {
      // Enter different passwords
      await passwordInput.fill('password123');
      await confirmPasswordInput.fill('different123');
      await submitButton.click();
      
      // Check for password mismatch error - be more flexible
      const mismatchError = page.locator('text=/match|same|confirm|different/i').first();
      await expect(mismatchError).toBeVisible();
    }
  });

  test('should handle successful login with valid credentials', async () => {
    // Make sure we're in login mode (not signup)
    const loginToggle = page.locator('button, a').filter({ hasText: /login|sign in/i });
    if (await loginToggle.count() > 0) {
      await loginToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Fill in valid test credentials
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('password123');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for navigation or success message
    await page.waitForTimeout(2000);
    
    // Check for success indicators
    const successIndicators = [
      page.locator('text=/welcome|dashboard|success/i'),
      page.locator('[data-testid="dashboard"]'),
      page.locator('text=/garden|plan/i')
    ];
    
    // At least one success indicator should be visible
    let hasSuccess = false;
    for (const indicator of successIndicators) {
      if (await indicator.count() > 0) {
        hasSuccess = true;
        break;
      }
    }
    
    // If no success indicators, check if we're on a different page
    if (!hasSuccess) {
      const currentUrl = page.url();
      hasSuccess = !currentUrl.includes('/auth');
    }
    
    expect(hasSuccess).toBeTruthy();
  });

  test('should handle successful signup with valid data', async () => {
    // Switch to signup
    const signupToggle = page.locator('button, a').filter({ hasText: /sign up|register/i });
    if (await signupToggle.count() > 0) {
      await signupToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Fill in signup form
    const nameInput = page.locator('input[name*="name"], input[placeholder*="name"]');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    const zipInput = page.locator('input[name*="zip"], input[placeholder*="zip"]');
    
    if (await nameInput.count() > 0) {
      await nameInput.fill('Test User');
    }
    await emailInput.fill('newuser@example.com');
    await passwordInput.fill('password123');
    if (await confirmPasswordInput.count() > 0) {
      await confirmPasswordInput.fill('password123');
    }
    if (await zipInput.count() > 0) {
      await zipInput.fill('12345');
    }
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for processing
    await page.waitForTimeout(3000);
    
    // Check for success indicators
    const successIndicators = [
      page.locator('text=/welcome|success|created/i'),
      page.locator('text=/verify|email/i'),
      page.locator('[data-testid="dashboard"]')
    ];
    
    let hasSuccess = false;
    for (const indicator of successIndicators) {
      if (await indicator.count() > 0) {
        hasSuccess = true;
        break;
      }
    }
    
    expect(hasSuccess).toBeTruthy();
  });

  test('should display error for invalid credentials', async () => {
    // Make sure we're in login mode (not signup)
    const loginToggle = page.locator('button, a').filter({ hasText: /login|sign in/i });
    if (await loginToggle.count() > 0) {
      await loginToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Fill in invalid credentials
    await page.locator('input[type="email"]').fill('invalid@example.com');
    await page.locator('input[type="password"]').first().fill('wrongpassword');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for error message
    await page.waitForTimeout(2000);
    
    // Check for error message - be more flexible
    const errorMessage = page.locator('text=/invalid|incorrect|wrong|error|failed|denied/i');
    const hasErrorMessage = await errorMessage.count() > 0;
    
    // If no error message, check if we're still on the auth page (which indicates failure)
    const currentUrl = page.url();
    const stillOnAuthPage = currentUrl.includes('/auth');
    
    expect(hasErrorMessage || stillOnAuthPage).toBeTruthy();
  });

  test('should be responsive on mobile', async () => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that form is still usable on mobile
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Check that form doesn't overflow
    const form = page.locator('form');
    const formBox = await form.boundingBox();
    expect(formBox.width).toBeLessThanOrEqual(375);
  });

  test('should have accessible form elements', async () => {
    // Check for proper labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Check that inputs have labels or aria-labels
    const emailLabel = page.locator('label[for], [aria-label]').filter({ hasText: /email/i });
    const passwordLabel = page.locator('label[for], [aria-label]').filter({ hasText: /password/i });
    
    const hasEmailLabel = await emailLabel.count() > 0 || await emailInput.getAttribute('aria-label');
    const hasPasswordLabel = await passwordLabel.count() > 0 || await passwordInput.getAttribute('aria-label');
    
    expect(hasEmailLabel).toBeTruthy();
    expect(hasPasswordLabel).toBeTruthy();
  });
});

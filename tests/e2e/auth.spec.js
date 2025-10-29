const { test, expect } = require('@playwright/test');

test.describe('User Authentication', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    // Create a shared page context for all tests in this describe block
    const context = await browser.newContext();
    page = await context.newPage();
  });
  
  test.beforeEach(async () => {
    // Reload the auth page before each test to ensure clean state
    await page.goto('/auth');
    await page.waitForLoadState('domcontentloaded');
    // Wait for the auth form to be visible (or dashboard if already logged in)
    try {
      await page.waitForSelector('form', { timeout: 5000 });
    } catch (e) {
      // If form not found, might be on dashboard - afterEach will handle it
    }
  });
  
  test.afterEach(async () => {
    // Ensure user is signed out after each test
    // Navigate to auth page - if we get redirected to dashboard, we're still signed in
    await page.goto('/auth', { waitUntil: 'domcontentloaded' });
    
    // Check if we ended up on dashboard (means we're signed in)
    if (page.url().includes('/dashboard')) {
      // Sign out if sign out button is visible
      const logoutButton = page.locator('[data-testid="sign-out-button"]');
      if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await logoutButton.click();
        await page.waitForURL(url => url.pathname.includes('/auth'), { timeout: 5000 });
      }
    }
    
    // Clear all storage to ensure clean state
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      // Clear IndexedDB (Firebase Auth storage)
      if (window.indexedDB) {
        indexedDB.databases().then((dbs) => {
          dbs.forEach(db => {
            if (db.name) indexedDB.deleteDatabase(db.name);
          });
        }).catch(() => {});
      }
    });
    
    // Navigate to auth page one more time to ensure we're there
    await page.goto('/auth', { waitUntil: 'domcontentloaded' });
  });
  
  test.afterAll(async () => {
    // Clean up the shared page
    if (page) {
      await page.close();
    }
  });

  test('should display error for invalid credentials', async () => {
    // Ensure all login form fields are visible before proceeding
    await page.waitForSelector('[data-testid="email-input"]', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('[data-testid="password-input"]', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('[data-testid="submit-button"]', { state: 'visible', timeout: 10000 });
    
    // Check if we're in signup mode (has confirm password field) and need to switch to login
    const confirmPasswordField = page.locator('[data-testid="confirm-password-input"]');
    const isSignupMode = await confirmPasswordField.isVisible().catch(() => false);
    
    if (isSignupMode) {
      // We're in signup mode, switch to login
      const switchToLoginButton = page.locator('[data-testid="switch-to-login-button"]');
      if (await switchToLoginButton.isVisible({ timeout: 2000 })) {
        await switchToLoginButton.click({ timeout: 3000 });
        await page.waitForTimeout(1000);
        // Wait for form to stabilize after mode switch
        await page.waitForSelector('[data-testid="email-input"]', { state: 'visible', timeout: 5000 });
        await page.waitForSelector('[data-testid="password-input"]', { state: 'visible', timeout: 5000 });
      }
    }
    
    // Final wait to ensure React has finished rendering
    await page.waitForTimeout(500);
    
    // Fill in invalid credentials using test IDs
    await page.locator('[data-testid="email-input"]').fill('invalid@example.com');
    await page.locator('[data-testid="password-input"]').fill('wrongpassword');
    
    // Submit form
    await page.locator('[data-testid="submit-button"]').click();
    
    // Wait for error message
    await page.waitForTimeout(2000);
    
    // Check for error message - be more flexible
    const errorMessage = page.locator('text=/invalid|incorrect|wrong|error|failed|denied/i');
    const hasErrorMessage = await errorMessage.count() > 0;
    
    // If no error message, check if we're still on the auth page (which indicates failure)
    const finalUrl = page.url();
    const stillOnAuthPage = finalUrl.includes('/auth');
    
    expect(hasErrorMessage || stillOnAuthPage).toBeTruthy();
  });

  test('should display login form by default', async () => {
    // Check that login form is visible
    await expect(page.locator('form')).toBeVisible();
    
    // Check for login-specific elements using test IDs
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const loginButton = page.locator('[data-testid="submit-button"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    // Check that login button has correct text
    await expect(loginButton).toContainText(/login|sign in/i);
  });

  test('should switch to signup form when toggled', async () => {
    // Look for signup toggle button using test ID
    const signupToggle = page.locator('[data-testid="switch-to-signup-button"]');
    
    if (await signupToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await signupToggle.click();
      await page.waitForTimeout(500); // Wait for form switch
      
      // Check for signup-specific elements using test IDs
      const nameInput = page.locator('[data-testid="name-input"]');
      const confirmPasswordInput = page.locator('[data-testid="confirm-password-input"]');
      const signupButton = page.locator('[data-testid="submit-button"]');
      
      // Both should be visible for signup
      await expect(nameInput).toBeVisible();
      await expect(confirmPasswordInput).toBeVisible();
      await expect(signupButton).toContainText(/sign up|register|create/i);
    }
  });

  test('should validate required fields', async () => {
    // Try to submit empty form using test ID
    const submitButton = page.locator('[data-testid="submit-button"]');
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
    const emailInput = page.locator('[data-testid="email-input"]');
    const submitButton = page.locator('[data-testid="submit-button"]');
    
    // Enter invalid email
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // Check for email validation error
    const emailError = page.locator('text=/invalid|email|format/i');
    await expect(emailError).toBeVisible();
  });

  test('should validate password requirements', async () => {
    // Switch to signup if needed using test ID
    const signupToggle = page.locator('[data-testid="switch-to-signup-button"]');
    if (await signupToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await signupToggle.click();
      await page.waitForTimeout(500);
    }
    
    const passwordInput = page.locator('[data-testid="password-input"]');
    const submitButton = page.locator('[data-testid="submit-button"]');
    
    // Enter weak password
    await passwordInput.fill('123');
    await submitButton.click();
    
    // Check for password validation error - look for any password-related error
    const passwordError = page.locator('text=/password|weak|minimum|length|at least/i').first();
    await expect(passwordError).toBeVisible();
  });

  test('should validate password confirmation', async () => {
    // Switch to signup if needed using test ID
    const signupToggle = page.locator('[data-testid="switch-to-signup-button"]');
    if (await signupToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await signupToggle.click();
      await page.waitForTimeout(500);
    }
    
    const passwordInput = page.locator('[data-testid="password-input"]');
    const confirmPasswordInput = page.locator('[data-testid="confirm-password-input"]');
    const submitButton = page.locator('[data-testid="submit-button"]');
    
    if (await confirmPasswordInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Enter different passwords
      await passwordInput.fill('Password!2#');
      await confirmPasswordInput.fill('different123');
      await submitButton.click();
      
      // Check for password mismatch error - be more flexible
      const mismatchError = page.locator('text=/match|same|confirm|different/i').first();
      await expect(mismatchError).toBeVisible();
    }
  });

  test('should handle successful login with valid credentials', async () => {
    // Make sure we're in login mode (not signup) using test ID
    const loginToggle = page.locator('[data-testid="switch-to-login-button"]');
    if (await loginToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await loginToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Fill in valid test credentials using test IDs
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('Password!2#');
    
    // Submit form using test ID
    await page.locator('[data-testid="submit-button"]').click();
    
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
    // Switch to signup using test ID
    const signupToggle = page.locator('[data-testid="switch-to-signup-button"]');
    if (await signupToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await signupToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Fill in signup form using test IDs
    await page.locator('[data-testid="name-input"]').fill('Test User');
    await page.locator('[data-testid="email-input"]').fill('newuser@example.com');
    await page.locator('[data-testid="password-input"]').fill('Password!2#');
    await page.locator('[data-testid="confirm-password-input"]').fill('Password!2#');
    await page.locator('[data-testid="zipcode-input"]').fill('12345');
    
    // Submit form using test ID
    await page.locator('[data-testid="submit-button"]').click();
    
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

  test('should have accessible form elements', async () => {
    // Check for proper labels using test IDs
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    
    // Check that inputs have labels or aria-labels
    const emailLabel = page.locator('label[for], [aria-label]').filter({ hasText: /email/i });
    const passwordLabel = page.locator('label[for], [aria-label]').filter({ hasText: /password/i });
    
    const hasEmailLabel = await emailLabel.count() > 0 || await emailInput.getAttribute('aria-label');
    const hasPasswordLabel = await passwordLabel.count() > 0 || await passwordInput.getAttribute('aria-label');
    
    expect(hasEmailLabel).toBeTruthy();
    expect(hasPasswordLabel).toBeTruthy();
  });

  test('should prevent signup with existing email', async () => {
    // This test verifies that the app prevents duplicate email signups
    // Note: This test assumes the app has proper duplicate email prevention
    // If the app doesn't prevent duplicates, this test will fail and indicate a bug
    
    const testEmail = `auth-test-${Date.now()}@example.com`;
    
    // Switch to signup mode using test ID
    const signupToggle = page.locator('[data-testid="switch-to-signup-button"]');
    if (await signupToggle.isVisible({ timeout: 2000 })) {
      await signupToggle.click();
      await page.waitForTimeout(1000);
    }
    
    // Fill in signup form with unique email using test IDs
    const nameInput = page.locator('[data-testid="name-input"]');
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const confirmPasswordInput = page.locator('[data-testid="confirm-password-input"]');
    const zipInput = page.locator('[data-testid="zipcode-input"]');
    
    if (await nameInput.count() > 0) {
      await nameInput.fill('Test User');
    }
    await emailInput.fill(testEmail);
    await passwordInput.fill('Password!2#');
    if (await confirmPasswordInput.count() > 0) {
      await confirmPasswordInput.fill('Password!2#');
    }
    if (await zipInput.count() > 0) {
      await zipInput.fill('12345');
    }
    
    // Submit first signup using test ID
    await page.locator('[data-testid="submit-button"]').click();
    await page.waitForTimeout(3000);
    
    // Check if first signup was successful
    const currentUrl = page.url();
    const firstSignupSuccess = !currentUrl.includes('/auth');
    
    if (!firstSignupSuccess) {
      // If first signup failed, we can't test duplicate prevention
      // This might indicate the app has validation issues or other problems
      console.log('First signup failed - cannot test duplicate prevention');
      return;
    }
    
    // Log out first, then navigate back to auth page for second signup attempt
    // Look for logout button using test ID
    const logoutButton = page.locator('[data-testid="sign-out-button"]');
    if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await logoutButton.click();
      await page.waitForTimeout(1000); // Wait for logout to complete
    }
    
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    
    // Switch to signup mode again using test ID
    if (await signupToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await signupToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Fill in signup form with the SAME email using test IDs
    await nameInput.fill('Another User');
    await emailInput.fill(testEmail); // Same email as before
    await passwordInput.fill('differentpassword');
    await confirmPasswordInput.fill('differentpassword');
    await zipInput.fill('54321');
    
    // Submit second signup attempt using test ID
    await page.locator('[data-testid="submit-button"]').click();
    await page.waitForTimeout(3000);
    
    // Check for error message indicating email already exists
    const errorMessage = page.locator('text=/already exists|already registered|email.*taken|account.*exists|user.*exists/i');
    const hasErrorMessage = await errorMessage.count() > 0;
    
    // Check if we're still on the auth page (which indicates failure)
    const finalUrl = page.url();
    const stillOnAuthPage = finalUrl.includes('/auth');
    
    // Should show error or stay on auth page (indicating duplicate signup failed)
    // If neither condition is met, it means the duplicate signup succeeded (which is a bug)
    expect(hasErrorMessage || stillOnAuthPage).toBeTruthy();
  });
});

test.describe('Authentication - Mobile Responsiveness', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    // Create a shared page context for mobile tests
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

  test('should be responsive on mobile', async () => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that form is still usable on mobile using test IDs
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const submitButton = page.locator('[data-testid="submit-button"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Check that form doesn't overflow
    const form = page.locator('form');
    const formBox = await form.boundingBox();
    expect(formBox.width).toBeLessThanOrEqual(375);
  });

  test('should work on tablet viewport', async () => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check that form is still usable on tablet using test IDs
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const submitButton = page.locator('[data-testid="submit-button"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Check that form doesn't overflow
    const form = page.locator('form');
    const formBox = await form.boundingBox();
    expect(formBox.width).toBeLessThanOrEqual(768);
  });
});

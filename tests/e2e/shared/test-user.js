// Shared test user configuration
const TEST_USER = {
  email: 'test-user@example.com',
  password: 'testpassword123',
  name: 'Test User',
  zipCode: '12345'
};

// Test user creation helper
async function ensureTestUserExists(page) {
  console.log('Checking if test user exists...');
  
  // Check if user already exists by trying to login
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  await page.goto(`${baseUrl}/auth`);
  await page.waitForLoadState('networkidle');
  
  try {
    // Try to login with test user
    await page.locator('input[type="email"]').fill(TEST_USER.email);
    await page.locator('input[type="password"]').first().fill(TEST_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    
    // Check if login was successful
    const currentUrl = page.url();
    if (!currentUrl.includes('/auth')) {
      console.log('✅ Test user already exists and login successful');
      return true;
    } else {
      console.log('❌ Test user login failed, user may not exist');
    }
  } catch (error) {
    console.log('❌ Test user login failed with error:', error.message);
  }
  
  // User doesn't exist or login failed, create it
  console.log('Creating new test user...');
  return await createTestUser(page);
}

async function createTestUser(page) {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  await page.goto(`${baseUrl}/auth`);
  await page.waitForLoadState('networkidle');
  
  // Switch to signup
  const signupToggle = page.locator('button, a').filter({ hasText: /sign up|register/i });
  if (await signupToggle.count() > 0) {
    await signupToggle.click();
    await page.waitForTimeout(500);
  }
  
  // Fill signup form
  const nameInput = page.locator('input[name*="name"], input[placeholder*="name"]');
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]').first();
  const confirmPasswordInput = page.locator('input[type="password"]').nth(1);
  const zipInput = page.locator('input[name*="zip"], input[placeholder*="zip"]');
  
  if (await nameInput.count() > 0) {
    await nameInput.fill(TEST_USER.name);
  }
  await emailInput.fill(TEST_USER.email);
  await passwordInput.fill(TEST_USER.password);
  if (await confirmPasswordInput.count() > 0) {
    await confirmPasswordInput.fill(TEST_USER.password);
  }
  if (await zipInput.count() > 0) {
    await zipInput.fill(TEST_USER.zipCode);
  }
  
  // Submit signup
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
  
  // Check if signup was successful
  const currentUrl = page.url();
  const signupSuccess = !currentUrl.includes('/auth');
  
  if (signupSuccess) {
    console.log('✅ Test user created successfully');
  } else {
    console.log('❌ Test user creation failed - still on auth page');
    console.log('Current URL:', currentUrl);
  }
  
  return signupSuccess;
}

module.exports = {
  TEST_USER,
  ensureTestUserExists,
  createTestUser
};

const { chromium } = require('@playwright/test');
const { ensureTestUserExists } = require('./shared/test-user');

async function globalSetup(_config) {
  console.log('🚀 Setting up global test user...');
  
  // Create a browser instance for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Ensure test user exists
    const userExists = await ensureTestUserExists(page);
    
    if (userExists) {
      console.log('✅ Global test user setup complete');
    } else {
      console.log('❌ Global test user setup failed');
    }
  } catch (error) {
    console.error('❌ Failed to setup test user:', error);
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;

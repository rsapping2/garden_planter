// Environment configuration
const config = {
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Custom environment variable (defaults to development if not set)
  environment: process.env.REACT_APP_ENV || 'development',
  
  // Feature flags
  showDemoCodes: process.env.REACT_APP_SHOW_DEMO_CODES === 'true' || process.env.NODE_ENV === 'development',
  enableMockEmail: process.env.REACT_APP_ENABLE_MOCK_EMAIL === 'true' || process.env.NODE_ENV === 'development',
  
  // API endpoints (for real implementation)
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  emailServiceUrl: process.env.REACT_APP_EMAIL_SERVICE_URL || 'https://garden-planner-api.your-subdomain.workers.dev',
  emailApiKey: process.env.REACT_APP_EMAIL_API_KEY || '', // SendGrid, Mailgun, etc. API key
};

export default config;

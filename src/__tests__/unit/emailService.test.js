import emailService from '../../services/emailService';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
global.localStorage = localStorageMock;

// Mock config to enable mock email
jest.mock('../../config/environment', () => ({
  __esModule: true,
  default: {
    enableMockEmail: true,
    showDemoCodes: true
  }
}));

describe('EmailService', () => {
  beforeEach(() => {
    localStorage.clear();
    emailService.pendingVerifications.clear();
    jest.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('should generate a 6-digit verification code', async () => {
      const email = 'test@example.com';
      const result = await emailService.sendVerificationEmail(email);

      expect(result.success).toBe(true);
      expect(result.demoCode).toMatch(/^\d{6}$/);
    });

    it('should store verification code in service', async () => {
      const email = 'test@example.com';
      await emailService.sendVerificationEmail(email);

      const stored = emailService.pendingVerifications.get(email);
      expect(stored).toBeDefined();
      expect(stored.code).toMatch(/^\d{6}$/);
      expect(stored.attempts).toBe(0);
    });

    it('should store timestamp with verification code', async () => {
      const email = 'test@example.com';
      const before = Date.now();
      await emailService.sendVerificationEmail(email);
      const after = Date.now();

      const stored = emailService.pendingVerifications.get(email);
      expect(stored.timestamp).toBeGreaterThanOrEqual(before);
      expect(stored.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('verifyEmail', () => {
    it('should verify correct code', async () => {
      const email = 'test@example.com';
      const { demoCode } = await emailService.sendVerificationEmail(email);

      const result = await emailService.verifyEmail(email, demoCode);

      expect(result.success).toBe(true);
      expect(result.message).toContain('verified');
    });

    it('should reject incorrect code', async () => {
      const email = 'test@example.com';
      await emailService.sendVerificationEmail(email);

      const result = await emailService.verifyEmail(email, '000000');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid');
    });

    it('should increment attempts on failed verification', async () => {
      const email = 'test@example.com';
      await emailService.sendVerificationEmail(email);

      await emailService.verifyEmail(email, '000000');
      await emailService.verifyEmail(email, '111111');

      const stored = emailService.pendingVerifications.get(email);
      expect(stored.attempts).toBe(2);
    });

    it('should block after 3 failed attempts', async () => {
      const email = 'test@example.com';
      await emailService.sendVerificationEmail(email);

      await emailService.verifyEmail(email, '000000');
      await emailService.verifyEmail(email, '111111');
      await emailService.verifyEmail(email, '222222');

      const result = await emailService.verifyEmail(email, '333333');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Too many');
    });

    it('should reject expired codes (older than 10 minutes)', async () => {
      const email = 'test@example.com';
      const { code } = await emailService.sendVerificationEmail(email);

      // Manually set timestamp to 11 minutes ago
      const stored = emailService.pendingVerifications.get(email);
      stored.timestamp = Date.now() - (11 * 60 * 1000);

      const result = await emailService.verifyEmail(email, code);

      expect(result.success).toBe(false);
      expect(result.message).toContain('expired');
    });

    it('should accept non-expired codes (within 10 minutes)', async () => {
      const email = 'test@example.com';
      const { demoCode } = await emailService.sendVerificationEmail(email);

      // Manually set timestamp to 9 minutes ago
      const stored = emailService.pendingVerifications.get(email);
      stored.timestamp = Date.now() - (9 * 60 * 1000);

      const result = await emailService.verifyEmail(email, demoCode);

      expect(result.success).toBe(true);
    });

    it('should handle non-existent email', async () => {
      const result = await emailService.verifyEmail('nonexistent@example.com', '123456');

      expect(result.success).toBe(false);
      expect(result.message).toContain('No verification');
    });

    it('should remove verification data on successful verification', async () => {
      const email = 'test@example.com';
      const { demoCode } = await emailService.sendVerificationEmail(email);

      await emailService.verifyEmail(email, demoCode);

      const stored = emailService.pendingVerifications.get(email);
      expect(stored).toBeUndefined();
    });
  });
});


import config from '../config/environment';
import { debugLog } from '../utils/debugLogger';

class EmailService {
  constructor() {
    this.pendingVerifications = new Map(); // Store pending verification codes
    // Load existing verifications from localStorage
    this.loadVerifications();
  }

  loadVerifications() {
    try {
      const stored = localStorage.getItem('emailVerifications');
      if (stored) {
        const verifications = JSON.parse(stored);
        this.pendingVerifications = new Map(Object.entries(verifications));
      }
    } catch (error) {
      console.error('Error loading verifications from localStorage:', error);
    }
  }

  saveVerifications() {
    try {
      const verifications = Object.fromEntries(this.pendingVerifications);
      localStorage.setItem('emailVerifications', JSON.stringify(verifications));
    } catch (error) {
      console.error('Error saving verifications to localStorage:', error);
    }
  }

  /**
   * Send verification email
   * @param {string} email - Email address to send verification to
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async sendVerificationEmail(email) {
    try {
      if (config.enableMockEmail) {
        // Mock implementation - generate and store a verification code
        const verificationCode = this.generateVerificationCode();
        this.pendingVerifications.set(email, {
          code: verificationCode,
          timestamp: Date.now(),
          attempts: 0
        });
        
        // Save to localStorage for persistence
        this.saveVerifications();

        debugLog(`[MOCK EMAIL] Verification code for ${email}: ${verificationCode}`);
        
        return {
          success: true,
          message: 'Verification email sent successfully (mock)',
          ...(config.showDemoCodes && { demoCode: verificationCode })
        };
      } else {
        // Production fallback - email service not configured
        const verificationCode = this.generateVerificationCode();
        this.pendingVerifications.set(email, {
          code: verificationCode,
          timestamp: Date.now(),
          attempts: 0
        });
        
        // Save to localStorage for persistence
        this.saveVerifications();

        // Show production popup with temporary code
        this.showProductionVerificationPopup(email, verificationCode);
        
        return {
          success: true,
          message: 'Verification code generated (see popup)',
          demoCode: verificationCode
        };
      }
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'Failed to send verification email. Please try again.'
      };
    }
  }

  /**
   * Verify email with code
   * @param {string} email - Email address
   * @param {string} code - Verification code
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifyEmail(email, code) {
    try {
      if (config.enableMockEmail) {
        // Mock implementation - check stored verification code
        const stored = this.pendingVerifications.get(email);
        
        if (!stored) {
          return {
            success: false,
            message: 'No verification code found. Please request a new one.'
          };
        }

        // Check if code is expired (10 minutes)
        const isExpired = Date.now() - stored.timestamp > 10 * 60 * 1000;
        if (isExpired) {
          this.pendingVerifications.delete(email);
          return {
            success: false,
            message: 'Verification code has expired. Please request a new one.'
          };
        }

        // Check attempts (max 3)
        if (stored.attempts >= 3) {
          this.pendingVerifications.delete(email);
          return {
            success: false,
            message: 'Too many failed attempts. Please request a new verification code.'
          };
        }

        // Verify code
        if (stored.code === code) {
          this.pendingVerifications.delete(email);
          this.saveVerifications(); // Save the deletion
          return {
            success: true,
            message: 'Email verified successfully!'
          };
        } else {
          // Increment attempts
          stored.attempts += 1;
          this.saveVerifications(); // Save the updated attempts
          this.pendingVerifications.set(email, stored);
          
          return {
            success: false,
            message: `Invalid verification code. ${3 - stored.attempts} attempts remaining.`
          };
        }
      } else {
        // Production fallback - use same logic as mock but without demo codes
        const stored = this.pendingVerifications.get(email);
        
        if (!stored) {
          return {
            success: false,
            message: 'No verification code found. Please request a new one.'
          };
        }

        // Check if code is expired (10 minutes)
        const isExpired = Date.now() - stored.timestamp > 10 * 60 * 1000;
        if (isExpired) {
          this.pendingVerifications.delete(email);
          return {
            success: false,
            message: 'Verification code has expired. Please request a new one.'
          };
        }

        // Check attempts (max 3)
        if (stored.attempts >= 3) {
          this.pendingVerifications.delete(email);
          return {
            success: false,
            message: 'Too many failed attempts. Please request a new verification code.'
          };
        }

        // Verify code
        if (stored.code === code) {
          this.pendingVerifications.delete(email);
          this.saveVerifications(); // Save the deletion
          return {
            success: true,
            message: 'Email verified successfully!'
          };
        } else {
          // Increment attempts
          stored.attempts += 1;
          this.saveVerifications(); // Save the updated attempts
          this.pendingVerifications.set(email, stored);
          
          return {
            success: false,
            message: `Invalid verification code. ${3 - stored.attempts} attempts remaining.`
          };
        }
      }
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: 'Verification failed. Please try again.'
      };
    }
  }

  /**
   * Send test notification email
   * @param {string} email - Email address to send test notification to
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async sendTestNotification(email) {
    try {
      if (config.enableMockEmail) {
        // Mock implementation - log to console
        debugLog(`[MOCK EMAIL] Test notification sent to ${email}`);
        debugLog('Subject: 🌱 Garden Planner Test Notification');
        debugLog('Body: This is a test notification from Garden Planner! Your email notifications are working correctly.');
        
        return {
          success: true,
          message: 'Test notification email sent successfully (mock)'
        };
      } else {
        // Production implementation - send real email
        /* 
        const response = await fetch(`${config.emailServiceUrl}/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.emailApiKey}` // Add to environment config
          },
          body: JSON.stringify({
            to: email,
            subject: '🌱 Garden Planner Test Notification',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">🌱 Garden Planner Test</h2>
                <p>This is a test notification from Garden Planner!</p>
                <p>Your email notifications are working correctly.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">
                  You received this because you tested notifications in your Garden Planner account.
                </p>
              </div>
            `,
            text: 'This is a test notification from Garden Planner! Your email notifications are working correctly.'
          })
        });

        const result = await response.json();
        return {
          success: result.success,
          message: result.message || 'Test notification sent successfully!'
        };
        */
        
        // Fallback to mock for now
        return this.sendTestNotification(email);
      }
    } catch (error) {
      console.error('Test notification error:', error);
      return {
        success: false,
        message: 'Failed to send test notification. Please try again.'
      };
    }
  }

  /**
   * Send task reminder email
   * @param {string} email - Email address
   * @param {Object} task - Task object with type, title, dueDate, etc.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async sendTaskReminder(email, task) {
    try {
      if (config.enableMockEmail) {
        // Mock implementation - log to console
        debugLog(`[MOCK EMAIL] Task reminder sent to ${email}`);
        debugLog(`Subject: 🌱 Garden Reminder: ${task.title}`);
        debugLog(`Task: ${task.title} (${task.type})`);
        debugLog(`Due: ${task.dueDate}`);
        debugLog(`Garden: ${task.gardenName || 'Unknown'}`);
        
        return {
          success: true,
          message: 'Task reminder email sent successfully (mock)'
        };
      } else {
        // Production implementation - send real email
        /*
        const taskTypeEmojis = {
          watering: '💧',
          planting: '🌱',
          harvest: '🌾',
          fertilizing: '🌿',
          pruning: '✂️'
        };

        const emoji = taskTypeEmojis[task.type] || '📋';
        
        const response = await fetch(`${config.emailServiceUrl}/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.emailApiKey}`
          },
          body: JSON.stringify({
            to: email,
            subject: `🌱 Garden Reminder: ${task.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">${emoji} Garden Reminder</h2>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin: 0 0 10px 0; color: #374151;">${task.title}</h3>
                  <p style="margin: 5px 0; color: #6b7280;">
                    <strong>Type:</strong> ${task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                  </p>
                  <p style="margin: 5px 0; color: #6b7280;">
                    <strong>Due:</strong> ${new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  ${task.gardenName ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Garden:</strong> ${task.gardenName}</p>` : ''}
                  ${task.plantName ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Plant:</strong> ${task.plantName}</p>` : ''}
                </div>
                <p>Don't forget to mark this task as complete in your Garden Planner!</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">
                  You received this reminder because you have email notifications enabled in your Garden Planner account.
                </p>
              </div>
            `,
            text: `Garden Reminder: ${task.title}\n\nType: ${task.type}\nDue: ${new Date(task.dueDate).toLocaleDateString()}\n${task.gardenName ? `Garden: ${task.gardenName}\n` : ''}${task.plantName ? `Plant: ${task.plantName}\n` : ''}\nDon't forget to mark this task as complete in your Garden Planner!`
          })
        });

        const result = await response.json();
        return {
          success: result.success,
          message: result.message || 'Task reminder sent successfully!'
        };
        */
        
        // Fallback to mock for now
        return this.sendTaskReminder(email, task);
      }
    } catch (error) {
      console.error('Task reminder error:', error);
      return {
        success: false,
        message: 'Failed to send task reminder. Please try again.'
      };
    }
  }

  /**
   * Send daily/weekly garden summary email
   * @param {string} email - Email address
   * @param {Object} summary - Summary object with tasks, gardens, etc.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async sendGardenSummary(email, summary) {
    try {
      if (config.enableMockEmail) {
        // Mock implementation - log to console
        debugLog(`[MOCK EMAIL] Garden summary sent to ${email}`);
        debugLog(`Subject: 🌱 Your Garden Summary - ${new Date().toLocaleDateString()}`);
        debugLog(`Upcoming tasks: ${summary.upcomingTasks?.length || 0}`);
        debugLog(`Gardens: ${summary.gardens?.length || 0}`);
        
        return {
          success: true,
          message: 'Garden summary email sent successfully (mock)'
        };
      } else {
        // Production implementation would go here
        /*
        const response = await fetch(`${config.emailServiceUrl}/send-summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.emailApiKey}`
          },
          body: JSON.stringify({
            to: email,
            subject: `🌱 Your Garden Summary - ${new Date().toLocaleDateString()}`,
            html: // ... detailed HTML template with summary data
            text: // ... plain text version
          })
        });
        */
        
        // Fallback to mock for now
        return this.sendGardenSummary(email, summary);
      }
    } catch (error) {
      console.error('Garden summary error:', error);
      return {
        success: false,
        message: 'Failed to send garden summary. Please try again.'
      };
    }
  }

  /**
   * Generate a 6-digit verification code
   * @returns {string}
   */
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Check if demo codes should be shown
   * @returns {boolean}
   */
  shouldShowDemoCodes() {
    return config.showDemoCodes;
  }

  /**
   * Get pending verification info (for demo purposes)
   * @param {string} email
   * @returns {object|null}
   */
  getPendingVerification(email) {
    if (config.showDemoCodes && config.enableMockEmail) {
      return this.pendingVerifications.get(email) || null;
    }
    return null;
  }

  /**
   * Show production verification popup with temporary code
   * @param {string} email - Email address
   * @param {string} code - Verification code
   */
  showProductionVerificationPopup(email, code) {
    // Create popup element
    const popup = document.createElement('div');
    popup.id = 'email-verification-popup';
    popup.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    popup.innerHTML = `
      <div style="
        background: white;
        border-radius: 12px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        text-align: center;
      ">
        <div style="font-size: 48px; margin-bottom: 16px;">📧</div>
        <h2 style="
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        ">Email Service Not Connected</h2>
        <p style="
          color: #6b7280;
          margin: 0 0 24px 0;
          line-height: 1.5;
        ">
          Real email verification is not configured for production.<br>
          Use this temporary verification code:
        </p>
        
        <div style="
          background: #f3f4f6;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
        ">
          <div style="
            font-size: 32px;
            font-weight: 700;
            color: #16a34a;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
          ">${code}</div>
        </div>
        
        <p style="
          color: #6b7280;
          font-size: 14px;
          margin: 16px 0 24px 0;
        ">
          This code will expire in 10 minutes.<br>
          Copy and paste it into the verification form.
        </p>
        
        <button onclick="document.getElementById('email-verification-popup').remove()" style="
          background: #16a34a;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        " onmouseover="this.style.background='#15803d'" onmouseout="this.style.background='#16a34a'">
          Got it!
        </button>
      </div>
    `;

    // Add to page
    document.body.appendChild(popup);

    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (document.getElementById('email-verification-popup')) {
        document.getElementById('email-verification-popup').remove();
      }
    }, 30000);
  }
}

// Export singleton instance
const emailService = new EmailService();
export default emailService;

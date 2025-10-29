import React, { useState, useEffect } from 'react';
import emailService from '../services/emailService';

const EmailVerification = ({ email, onVerified, onResend }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [demoCode, setDemoCode] = useState(null);

  // Send initial verification email when component mounts
  useEffect(() => {
    const sendInitialEmail = async () => {
      try {
        const result = await emailService.sendVerificationEmail(email);
        if (result.demoCode) {
          setDemoCode(result.demoCode);
        }
      } catch (error) {
        console.error('Failed to send initial verification email:', error);
      }
    };

    sendInitialEmail();
  }, [email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await emailService.verifyEmail(email, verificationCode);
      
      if (result.success) {
        onVerified();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await emailService.sendVerificationEmail(email);
      
      if (result.success) {
        onResend();
        setResendCooldown(60); // 60 second cooldown
        
        // Update demo code if available
        if (result.demoCode) {
          setDemoCode(result.demoCode);
        }
        
        // Countdown timer
        const timer = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600">
          We've sent a 6-digit verification code to:
        </p>
        <p className="font-medium text-primary-600">{email}</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
            placeholder="123456"
            maxLength="6"
            required
            data-testid="verification-code-input"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading || verificationCode.length !== 6}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="verify-email-button"
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
        <button
          onClick={handleResend}
          disabled={isLoading || resendCooldown > 0}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
        </button>
      </div>

      {emailService.shouldShowDemoCodes() && demoCode && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md" data-testid="demo-code-display">
          <p className="text-xs text-blue-800">
            <strong>Demo:</strong> Use code <code className="bg-blue-100 px-1 rounded" data-testid="demo-code-text">{demoCode}</code> to verify
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;

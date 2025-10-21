import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmailVerification from '../components/EmailVerification';
import { getUSDAZone } from '../utils/usdaZones';
import { debugLog } from '../utils/debugLogger';

const ProfilePage = () => {
  const { user, updateProfile, markEmailAsVerified, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    zipCode: user?.zipCode || '',
    usdaZone: user?.usdaZone || ''
  });
  
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showEmailChangeConfirm, setShowEmailChangeConfirm] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Update form data when user data becomes available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        zipCode: user.zipCode || '',
        usdaZone: user.usdaZone || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      
      // Update USDA zone when ZIP code changes
      if (name === 'zipCode' && value) {
        updated.usdaZone = getUSDAZone(value);
      }
      
      return updated;
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Check if email changed
      if (formData.email !== user.email) {
        setPendingEmail(formData.email);
        setShowEmailChangeConfirm(true);
        setIsLoading(false);
        return;
      }

      // Update user data
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerified = async () => {
    try {
      // Check if we're verifying a new email or the current email
      const isEmailChange = pendingEmail !== user?.email;
      
      if (isEmailChange) {
        // Changing to a new email
        await updateProfile({ 
          ...formData, 
          email: pendingEmail,
          emailVerified: true,
          emailNotifications: false // Reset email notifications when email changes
        });
        setMessage('Email updated and verified successfully! Email notifications have been disabled - you can re-enable them in notification settings.');
      } else {
        // Just verifying the current email - use the new function to persist in Firestore
        await markEmailAsVerified();
        setMessage('Email verified successfully! You can now use all notification features.');
      }
      
      setShowEmailVerification(false);
      setPendingEmail('');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to verify email. Please try again.');
    }
  };

  const handleResendEmail = async () => {
    // In a real app, this would call your backend to resend verification email
    debugLog('Resending verification email to:', pendingEmail);
  };

  const handleEmailChangeConfirm = () => {
    setShowEmailChangeConfirm(false);
    setShowEmailVerification(true);
  };

  const handleEmailChangeCancel = () => {
    setShowEmailChangeConfirm(false);
    setPendingEmail('');
    // Reset email to original value
    setFormData(prev => ({ ...prev, email: user?.email || '' }));
  };

  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <EmailVerification
          email={pendingEmail}
          onVerified={handleEmailVerified}
          onResend={handleResendEmail}
        />
      </div>
    );
  }


  // Email Change Confirmation Dialog
  if (showEmailChangeConfirm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Change Email Address</h2>
            <p className="text-gray-600">
              You're about to change your email from:
            </p>
            <p className="font-medium text-gray-900 mb-2">{user?.email}</p>
            <p className="text-gray-600">
              to:
            </p>
            <p className="font-medium text-primary-600 mb-4">{pendingEmail}</p>
            <p className="text-sm text-gray-500">
              We'll send a verification code to the new email address to confirm the change.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleEmailChangeCancel}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleEmailChangeConfirm}
              className="flex-1 btn-primary"
            >
              Send Verification
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to Dashboard
              </button>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                {formData.zipCode && (
                  <p className="mt-2 text-sm text-gray-600">
                    USDA Hardiness Zone: <span className="font-medium">{formData.usdaZone}</span>
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    {user?.emailVerified ? (
                      <p className="mt-1 text-sm text-green-600">✓ Email verified</p>
                    ) : (
                      <div className="mt-2">
                        <p className="text-sm text-orange-600 mb-2">⚠️ Email not verified</p>
                        <button
                          onClick={() => {
                            setPendingEmail(user?.email || '');
                            setShowEmailVerification(true);
                          }}
                          className="text-sm bg-primary-100 text-primary-700 hover:bg-primary-200 px-3 py-1 rounded-md transition-colors"
                        >
                          Verify Email Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notification Settings Link */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Manage Notification Preferences</p>
                      <p className="text-sm text-gray-500">
                        Configure email alerts, web push notifications, task types, and delivery frequency
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                        <span className={`flex items-center ${user?.emailNotifications ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className="w-2 h-2 rounded-full mr-1 bg-current"></span>
                          Email {user?.emailNotifications ? 'enabled' : 'disabled'}
                        </span>
                        <span className={`flex items-center ${user?.webPushNotifications ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className="w-2 h-2 rounded-full mr-1 bg-current"></span>
                          Web Push {user?.webPushNotifications ? 'enabled' : 'disabled'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/notifications')}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Open Notification →
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                {isEditing ? (
                  <>
                    <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        zipCode: user?.zipCode || '',
                        usdaZone: user?.usdaZone || ''
                      });
                      setMessage('');
                    }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

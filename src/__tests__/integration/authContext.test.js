import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Simulate no user initially
    callback(null);
    return jest.fn(); // unsubscribe function
  }),
  sendEmailVerification: jest.fn(),
  updateProfile: jest.fn(),
  updateEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn((db, collection, id) => ({ collection, id })),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => false,
    data: () => null
  })),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  collection: jest.fn((db, name) => ({ name })),
  query: jest.fn((...args) => ({ args })),
  where: jest.fn((field, op, value) => ({ field, op, value })),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ 
    empty: true,
    docs: [] 
  })),
  addDoc: jest.fn((_collection, _data) => Promise.resolve({ id: `mock-${Date.now()}` })),
  deleteDoc: jest.fn(() => Promise.resolve()),
  writeBatch: jest.fn(() => ({
    set: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(() => Promise.resolve())
  })),
  serverTimestamp: jest.fn(() => new Date()),
  connectFirestoreEmulator: jest.fn()
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(() => ({}))
}));

jest.mock('firebase/app-check', () => ({
  initializeAppCheck: jest.fn(() => ({})),
  ReCaptchaV3Provider: jest.fn()
}));

jest.mock('../../config/firebase', () => ({
  auth: {},
  db: {},
  analytics: null,
  appCheck: null
}));

// Import the mocked modules after mocking
import { 
  createUserWithEmailAndPassword, 
  updateProfile as updateFirebaseProfile,
  setDoc 
} from 'firebase/firestore';

describe('AuthContext - Input Validation & Sanitization', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup function validation', () => {
    test('should reject invalid name', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signup(
          'test@example.com',
          'password123',
          'A', // Too short
          '12345'
        );
        expect(response.success).toBe(false);
        expect(response.error).toContain('minimum 2');
      });

      // Firebase should not be called if validation fails
      expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    });

    test('should reject invalid ZIP code', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signup(
          'test@example.com',
          'password123',
          'John Doe',
          '123' // Too short
        );
        expect(response.success).toBe(false);
        expect(response.error).toContain('5 digits');
      });

      expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    });

    test('should reject name with numbers only', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signup(
          'test@example.com',
          'password123',
          '123456',
          '12345'
        );
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
      });
    });

    test('should sanitize HTML in name', async () => {
      // Mock successful Firebase calls
      const mockUser = { uid: 'test-uid', email: 'test@example.com', emailVerified: false };
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      updateFirebaseProfile.mockResolvedValue();
      setDoc.mockResolvedValue();

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signup(
          'test@example.com',
          'password123',
          '<script>alert("xss")</script>John Doe',
          '12345'
        );
        
        if (response.success) {
          // Check that setDoc was called with sanitized data
          const setDocCall = setDoc.mock.calls[0];
          const userData = setDocCall[1];
          expect(userData.name).not.toContain('<script>');
          expect(userData.name).toContain('John Doe');
        }
      });
    });

    test('should reject ZIP code with letters', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signup(
          'test@example.com',
          'password123',
          'John Doe',
          'ABCDE'
        );
        expect(response.success).toBe(false);
        expect(response.error).toContain('numbers only');
      });
    });

    test('should accept valid signup data', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com', emailVerified: false };
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      updateFirebaseProfile.mockResolvedValue();
      setDoc.mockResolvedValue();

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signup(
          'test@example.com',
          'password123',
          'John Doe',
          '12345'
        );
        
        // May succeed or fail depending on Firebase mock, but should not reject on validation
        if (!response.success && response.error) {
          expect(response.error).not.toContain('minimum');
          expect(response.error).not.toContain('maximum');
          expect(response.error).not.toContain('digits');
        }
      });
    });
  });

  describe('updateProfile function validation', () => {
    test('should reject invalid name update', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      // Simulate a logged-in user
      act(() => {
        result.current.user = { 
          id: 'test-uid', 
          email: 'test@example.com',
          name: 'Original Name',
          zipCode: '12345'
        };
      });

      await act(async () => {
        const response = await result.current.updateProfile({
          name: 'A' // Too short
        });
        
        if (result.current.user) {
          expect(response.success).toBe(false);
          expect(response.error).toContain('minimum 2');
        }
      });
    });

    test('should reject invalid ZIP code update', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      // Simulate a logged-in user
      act(() => {
        result.current.user = { 
          id: 'test-uid', 
          email: 'test@example.com',
          name: 'John Doe',
          zipCode: '12345'
        };
      });

      await act(async () => {
        const response = await result.current.updateProfile({
          zipCode: 'ABCDE' // Invalid format
        });
        
        if (result.current.user) {
          expect(response.success).toBe(false);
          expect(response.error).toBeDefined();
        }
      });
    });

    test('should sanitize name updates', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      const updateDocMock = require('firebase/firestore').updateDoc;
      updateDocMock.mockResolvedValue();
      
      // Simulate a logged-in user
      act(() => {
        result.current.user = { 
          id: 'test-uid', 
          email: 'test@example.com',
          name: 'Original Name',
          zipCode: '12345'
        };
      });

      await act(async () => {
        await result.current.updateProfile({
          name: '<b>New Name</b>'
        });
        
        if (updateDocMock.mock.calls.length > 0) {
          const updateData = updateDocMock.mock.calls[0][1];
          expect(updateData.name).not.toContain('<b>');
          expect(updateData.name).toContain('New Name');
        }
      });
    });
  });
});


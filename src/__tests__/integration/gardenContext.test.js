import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { GardenProvider, useGarden } from '../../contexts/GardenContext';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock Firebase modules
jest.mock('firebase/auth');

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn((db, collection, id) => ({ collection, id })),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => true,
    id: 'test-uid',
    data: () => ({
      name: 'Test User',
      email: 'test@example.com',
      zipCode: '12345',
      usdaZone: '10a',
      emailNotifications: true,
      webPushNotifications: true,
      emailVerified: true
    })
  })),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  collection: jest.fn((db, name) => ({ name })),
  query: jest.fn((...args) => ({ args })),
  where: jest.fn((field, op, value) => ({ field, op, value })),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
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

// Mock plant service
jest.mock('../../services/plantService', () => ({
  getPlants: jest.fn(() => Promise.resolve([
    {
      id: 'tomato',
      name: 'Tomato',
      type: 'vegetable',
      sun: 'full',
      soil: 'loamy',
      zoneMin: 3,
      zoneMax: 9
    }
  ]))
}));

// Mock task notification service
jest.mock('../../services/taskNotificationService', () => ({
  createTaskNotification: jest.fn(() => Promise.resolve('notification-id')),
  cancelTaskNotification: jest.fn(() => Promise.resolve())
}));

// Import mocked Firebase Auth functions
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';

// Set up the onAuthStateChanged mock implementation
onAuthStateChanged.mockImplementation((_auth, callback) => {
  // Simulate logged-in user immediately
  setTimeout(() => {
    callback({
      uid: 'test-uid',
      email: 'test@example.com',
      emailVerified: true
    });
  }, 0);
  // Return a plain function for unsubscribe
  return () => {};
});

// Ensure getDoc returns user data synchronously
getDoc.mockImplementation(() => Promise.resolve({
  exists: () => true,
  id: 'test-uid',
  data: () => ({
    name: 'Test User',
    email: 'test@example.com',
    zipCode: '12345',
    usdaZone: '10a',
    emailNotifications: true,
    webPushNotifications: true,
    emailVerified: true
  })
}));

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

describe('GardenContext - Input Validation & Sanitization', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>
      <GardenProvider>{children}</GardenProvider>
    </AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Re-set up the onAuthStateChanged mock after clearing
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({
        uid: 'test-uid',
        email: 'test@example.com',
        emailVerified: true
      });
      return () => {};
    });
  });

  describe('createGarden function validation', () => {
    test('should reject invalid garden name (too short)', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        // Wait for initial load
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        try {
          await result.current.createGarden({
            name: 'A', // Too short
            size: '3x6',
            description: 'Test garden'
          });
          throw new Error('Should have thrown an error');
        } catch (error) {
          expect(error.message).toContain('minimum 2');
        }
      });
    });

    test('should reject invalid garden name (too long)', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        try {
          await result.current.createGarden({
            name: 'A'.repeat(51), // Too long
            size: '3x6',
            description: 'Test garden'
          });
          throw new Error('Should have thrown an error');
        } catch (error) {
          expect(error.message).toContain('maximum 50');
        }
      });
    });

    test('should reject HTML in garden name', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        try {
          await result.current.createGarden({
            name: '<script>alert("xss")</script>Veggie Garden',
            size: '3x6',
            description: 'Test garden'
          });
          throw new Error('Should have thrown an error');
        } catch (error) {
          expect(error.message).toContain('letters');
        }
      });
    });


  });

  describe('addTask function validation', () => {
    test('should reject invalid task title (too short)', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        try {
          await result.current.addTask({
            title: 'A', // Too short
            type: 'watering',
            dueDate: '2024-12-01',
            gardenId: 'test-garden',
            gardenName: 'Test Garden',
            notes: ''
          });
          throw new Error('Should have thrown an error');
        } catch (error) {
          expect(error.message).toContain('minimum 2');
        }
      });
    });

    test('should reject invalid task title (too long)', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        try {
          await result.current.addTask({
            title: 'A'.repeat(101), // Too long
            type: 'watering',
            dueDate: '2024-12-01',
            gardenId: 'test-garden',
            gardenName: 'Test Garden',
            notes: ''
          });
          throw new Error('Should have thrown an error');
        } catch (error) {
          expect(error.message).toContain('maximum 100');
        }
      });
    });

    test('should reject invalid task notes (too long)', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        try {
          await result.current.addTask({
            title: 'Water plants',
            type: 'watering',
            dueDate: '2024-12-01',
            gardenId: 'test-garden',
            gardenName: 'Test Garden',
            notes: 'A'.repeat(501) // Too long
          });
          throw new Error('Should have thrown an error');
        } catch (error) {
          expect(error.message).toContain('maximum 500');
        }
      });
    });

  });
});


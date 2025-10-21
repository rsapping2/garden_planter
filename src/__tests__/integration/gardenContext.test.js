import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { GardenProvider, useGarden } from '../../contexts/GardenContext';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Simulate logged-in user
    callback({ 
      uid: 'test-uid', 
      email: 'test@example.com',
      emailVerified: true 
    });
    return jest.fn();
  }),
  sendEmailVerification: jest.fn(),
  updateProfile: jest.fn(),
  updateEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => true,
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
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  writeBatch: jest.fn(),
  serverTimestamp: jest.fn(),
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

    test('should sanitize HTML in garden name', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        const garden = result.current.createGarden({
          name: '<script>alert("xss")</script>Veggie Garden',
          size: '3x6',
          description: 'Test garden'
        });

        expect(garden.name).not.toContain('<script>');
        expect(garden.name).toContain('Veggie Garden');
      });
    });

    test('should accept valid garden name', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        const garden = result.current.createGarden({
          name: 'My Vegetable Garden',
          size: '3x6',
          description: 'Test garden'
        });

        expect(garden).toBeDefined();
        expect(garden.name).toBe('My Vegetable Garden');
      });
    });

    test('should sanitize garden description', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        const garden = result.current.createGarden({
          name: 'Test Garden',
          size: '3x6',
          description: '<b>Description</b> with HTML'
        });

        expect(garden.description).not.toContain('<b>');
        expect(garden.description).toContain('Description with HTML');
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

    test('should sanitize HTML in task title', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        const task = await result.current.addTask({
          title: '<script>alert("xss")</script>Water plants',
          type: 'watering',
          dueDate: '2024-12-01',
          gardenId: 'test-garden',
          gardenName: 'Test Garden',
          notes: ''
        });

        expect(task.title).not.toContain('<script>');
        expect(task.title).toContain('Water plants');
      });
    });

    test('should sanitize HTML in task notes', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        const task = await result.current.addTask({
          title: 'Water plants',
          type: 'watering',
          dueDate: '2024-12-01',
          gardenId: 'test-garden',
          gardenName: 'Test Garden',
          notes: '<img src=x onerror="alert(1)">Check soil moisture'
        });

        expect(task.notes).not.toContain('<img');
        expect(task.notes).toContain('Check soil moisture');
      });
    });

    test('should accept valid task data', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        const task = await result.current.addTask({
          title: 'Water tomato plants',
          type: 'watering',
          dueDate: '2024-12-01',
          gardenId: 'test-garden',
          gardenName: 'Test Garden',
          notes: 'Check soil moisture before watering',
          enableNotification: true,
          notificationTiming: '1',
          notificationType: 'both'
        });

        expect(task).toBeDefined();
        expect(task.title).toBe('Water tomato plants');
        expect(task.notes).toBe('Check soil moisture before watering');
      });
    });

    test('should handle empty notes', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await act(async () => {
        const task = await result.current.addTask({
          title: 'Water plants',
          type: 'watering',
          dueDate: '2024-12-01',
          gardenId: 'test-garden',
          gardenName: 'Test Garden',
          notes: ''
        });

        expect(task).toBeDefined();
        expect(task.notes).toBe('');
      });
    });
  });

  describe('XSS Attack Prevention', () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src=x onerror="alert(1)">',
      '<svg onload="alert(1)">',
      'javascript:alert(1)',
      '<iframe src="javascript:alert(1)">'
    ];

    test('should prevent XSS in garden names', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      for (const payload of xssPayloads) {
        await act(async () => {
          const garden = result.current.createGarden({
            name: `${payload}Test Garden`,
            size: '3x6',
            description: 'Test'
          });

          expect(garden.name).not.toContain('<');
          expect(garden.name).not.toContain('javascript:');
          expect(garden.name).toContain('Test Garden');
        });
      }
    });

    test('should prevent XSS in task titles and notes', async () => {
      const { result } = renderHook(() => useGarden(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      for (const payload of xssPayloads) {
        await act(async () => {
          const task = await result.current.addTask({
            title: `${payload}Water plants`,
            type: 'watering',
            dueDate: '2024-12-01',
            gardenId: 'test',
            gardenName: 'Test',
            notes: `${payload}Notes here`
          });

          expect(task.title).not.toContain('<');
          expect(task.title).not.toContain('javascript:');
          expect(task.notes).not.toContain('<');
          expect(task.notes).not.toContain('javascript:');
        });
      }
    });
  });
});


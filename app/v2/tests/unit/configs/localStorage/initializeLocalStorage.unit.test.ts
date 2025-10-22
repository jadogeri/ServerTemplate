
import { initializeLocalStorage } from '../../../../src/configs/localStorage';

// app/v2/src/configs/localStorage.test.ts
describe('initializeLocalStorage() initializeLocalStorage method', () => {
  // Save original global.localStorage to restore after tests
  const originalLocalStorage = global.localStorage;

  afterEach(() => {
    // Restore original localStorage after each test
    global.localStorage = originalLocalStorage;
    jest.resetModules();
    jest.clearAllMocks();
  });

  // =========================
  // Happy Path Tests
  // =========================

  test('should initialize and return a node-localstorage instance when localStorage is undefined', () => {
    // This test ensures that when localStorage is not available, the function initializes node-localstorage correctly.
    delete (global as any).localStorage;

    // Mock node-localstorage's LocalStorage constructor
    const mockLocalStorageInstance = { setItem: jest.fn(), getItem: jest.fn() };
    const mockLocalStorageConstructor = jest.fn().mockImplementation(() => mockLocalStorageInstance);

    jest.doMock('node-localstorage', () => ({
      LocalStorage: mockLocalStorageConstructor,
    }));

    // Re-import after mocking
    const { initializeLocalStorage: initializeLocalStorageMocked } = require("../localStorage");

    const path = '/tmp/test-storage';
    const result = initializeLocalStorageMocked(path);

    expect(mockLocalStorageConstructor).toHaveBeenCalledWith(path);
    expect(result).toBe(mockLocalStorageInstance);
  });

  test('should initialize and return a node-localstorage instance when localStorage is null', () => {
    // This test ensures that when localStorage is null, the function initializes node-localstorage correctly.
    (global as any).localStorage = null;

    const mockLocalStorageInstance = { setItem: jest.fn(), getItem: jest.fn() };
    const mockLocalStorageConstructor = jest.fn().mockImplementation(() => mockLocalStorageInstance);

    jest.doMock('node-localstorage', () => ({
      LocalStorage: mockLocalStorageConstructor,
    }));

    // Re-import after mocking
    const { initializeLocalStorage: initializeLocalStorageMocked } = require("../localStorage");

    const path = '/tmp/test-storage-null';
    const result = initializeLocalStorageMocked(path);

    expect(mockLocalStorageConstructor).toHaveBeenCalledWith(path);
    expect(result).toBe(mockLocalStorageInstance);
  });

  test('should not initialize node-localstorage and return undefined when localStorage exists', () => {
    // This test ensures that if localStorage is present, the function does not initialize node-localstorage and returns undefined.
    (global as any).localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
    };

    // Spy on require to ensure node-localstorage is not required
    const requireSpy = jest.spyOn(module, 'require');

    const path = '/tmp/should-not-be-used';
    const result = initializeLocalStorage(path);

    expect(requireSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  // =========================
  // Edge Case Tests
  // =========================

  test('should throw an error if node-localstorage cannot be initialized', () => {
    // This test ensures that if node-localstorage throws an error during initialization, the function propagates the error.
    delete (global as any).localStorage;

    const error = new Error('Initialization failed');
    const mockLocalStorageConstructor = jest.fn(() => {
      throw error;
    });

    jest.doMock('node-localstorage', () => ({
      LocalStorage: mockLocalStorageConstructor,
    }));

    // Re-import after mocking
    const { initializeLocalStorage: initializeLocalStorageMocked } = require("../localStorage");

    const path = '/tmp/should-throw';

    expect(() => initializeLocalStorageMocked(path)).toThrow(error);
  });

  test('should handle empty string as path and initialize node-localstorage', () => {
    // This test ensures that an empty string as the path is accepted and passed to node-localstorage.
    delete (global as any).localStorage;

    const mockLocalStorageInstance = { setItem: jest.fn(), getItem: jest.fn() };
    const mockLocalStorageConstructor = jest.fn().mockImplementation(() => mockLocalStorageInstance);

    jest.doMock('node-localstorage', () => ({
      LocalStorage: mockLocalStorageConstructor,
    }));

    // Re-import after mocking
    const { initializeLocalStorage: initializeLocalStorageMocked } = require("../localStorage");

    const path = '';
    const result = initializeLocalStorageMocked(path);

    expect(mockLocalStorageConstructor).toHaveBeenCalledWith(path);
    expect(result).toBe(mockLocalStorageInstance);
  });

  test('should handle a very long string as path and initialize node-localstorage', () => {
    // This test ensures that a very long string as the path is accepted and passed to node-localstorage.
    delete (global as any).localStorage;

    const mockLocalStorageInstance = { setItem: jest.fn(), getItem: jest.fn() };
    const mockLocalStorageConstructor = jest.fn().mockImplementation(() => mockLocalStorageInstance);

    jest.doMock('node-localstorage', () => ({
      LocalStorage: mockLocalStorageConstructor,
    }));

    // Re-import after mocking
    const { initializeLocalStorage: initializeLocalStorageMocked } = require("../localStorage");

    const path = '/tmp/' + 'a'.repeat(1000);
    const result = initializeLocalStorageMocked(path);

    expect(mockLocalStorageConstructor).toHaveBeenCalledWith(path);
    expect(result).toBe(mockLocalStorageInstance);
  });
});
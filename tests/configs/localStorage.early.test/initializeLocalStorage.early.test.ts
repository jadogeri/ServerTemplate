
// Unit tests for: initializeLocalStorage


import { LocalStorage } from "node-localstorage";
import { initializeLocalStorage } from '../../../src/configs/localStorage';




jest.mock("node-localstorage", () => {
  return {
    LocalStorage: jest.fn().mockImplementation(() => {
      return {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      };
    }),
  };
});

describe('initializeLocalStorage() initializeLocalStorage method', () => {
  let originalLocalStorage: any;

  beforeAll(() => {
    // Save the original localStorage to restore it after tests
    originalLocalStorage = global.localStorage;
  });

  afterAll(() => {
    // Restore the original localStorage
    global.localStorage = originalLocalStorage;
  });

  describe('Happy Paths', () => {
    it('should initialize localStorage when it is undefined', () => {
      // Arrange: Set localStorage to undefined
      global.localStorage = undefined;

      // Act: Call the function
      const path = '/tmp/localstorage';
      const localStorage = initializeLocalStorage(path);

      // Assert: Check if LocalStorage was initialized
      expect(LocalStorage).toHaveBeenCalledWith(path);
      expect(localStorage).toBeDefined();
    });

    it('should initialize localStorage when it is null', () => {
      // Arrange: Set localStorage to null
      global.localStorage = null;

      // Act: Call the function
      const path = '/tmp/localstorage';
      const localStorage = initializeLocalStorage(path);

      // Assert: Check if LocalStorage was initialized
      expect(LocalStorage).toHaveBeenCalledWith(path);
      expect(localStorage).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should not reinitialize localStorage if it is already defined', () => {
      // Arrange: Mock an existing localStorage
      const mockLocalStorage = {};
      global.localStorage = mockLocalStorage;

      // Act: Call the function
      const path = '/tmp/localstorage';
      const localStorage = initializeLocalStorage(path);

      // Assert: Check that LocalStorage was not called and the existing localStorage is returned
      expect(LocalStorage).not.toHaveBeenCalled();
      expect(localStorage).toBeUndefined();
    });

    it('should handle an empty path gracefully', () => {
      // Arrange: Set localStorage to undefined
      global.localStorage = undefined;

      // Act: Call the function with an empty path
      const path = '';
      const localStorage = initializeLocalStorage(path);

      // Assert: Check if LocalStorage was initialized with an empty path
      expect(LocalStorage).toHaveBeenCalledWith(path);
      expect(localStorage).toBeDefined();
    });

    it('should handle a non-string path gracefully', () => {
      // Arrange: Set localStorage to undefined
      global.localStorage = undefined;

      // Act: Call the function with a non-string path
      const path = 123 as unknown as string;
      const localStorage = initializeLocalStorage(path);

      // Assert: Check if LocalStorage was initialized with the coerced path
      expect(LocalStorage).toHaveBeenCalledWith(path);
      expect(localStorage).toBeDefined();
    });
  });
});

// End of unit tests for: initializeLocalStorage

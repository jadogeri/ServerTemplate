
// Unit tests for: initializeLocalStorage


import { LocalStorage } from "node-localstorage";
import { initializeLocalStorage } from '../../../src/configs/localStorage';


if (typeof localStorage === 'undefined') {
  const localStorageMock: Storage = {
    getItem: (key: string): string | null => null,
    setItem: (key: string, value: string) => {},
    removeItem: (key: string) => {},
    clear: () => {},
    length: 0,
    key: (index: number): string | null => null,
  };
  global.localStorage = localStorageMock;
}


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
    // Save the original localStorage if it exists
    originalLocalStorage = global.localStorage;
  });

  afterEach(() => {
    // Restore the original localStorage after each test
    global.localStorage = originalLocalStorage;
  });

  describe('Happy Paths', () => {
    it('should initialize localStorage when it is undefined', () => {
      // Test to ensure localStorage is initialized when it is undefined
      global.localStorage = undefined;
      const path = '/some/path';
      const localStorage = initializeLocalStorage(path);

      expect(LocalStorage).toHaveBeenCalledWith(path);
      expect(localStorage).toBeDefined();
    });

    it('should initialize localStorage when it is null', () => {
      // Test to ensure localStorage is initialized when it is null
      global.localStorage = null;
      const path = '/some/path';
      const localStorage = initializeLocalStorage(path);

      expect(LocalStorage).toHaveBeenCalledWith(path);
      expect(localStorage).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should not reinitialize localStorage if it is already defined', () => {
      // Test to ensure localStorage is not reinitialized if it already exists
      const mockLocalStorage = {};
      global.localStorage = mockLocalStorage;
      const path = '/some/path';
      const localStorage = initializeLocalStorage(path);

      expect(LocalStorage).not.toHaveBeenCalled();
      expect(localStorage).toBeUndefined();
    });

    it('should handle an empty path gracefully', () => {
      // Test to ensure the function handles an empty path gracefully
      global.localStorage = undefined;
      const path = '';
      const localStorage = initializeLocalStorage(path);

      expect(LocalStorage).toHaveBeenCalledWith(path);
      expect(localStorage).toBeDefined();
    });

    it('should handle a non-string path gracefully', () => {
      // Test to ensure the function handles a non-string path gracefully
      global.localStorage = undefined;
      const path = 123 as unknown as string;
      const localStorage = initializeLocalStorage(path);

      expect(LocalStorage).toHaveBeenCalledWith(path);
      expect(localStorage).toBeDefined();
    });
  });
});

// End of unit tests for: initializeLocalStorage

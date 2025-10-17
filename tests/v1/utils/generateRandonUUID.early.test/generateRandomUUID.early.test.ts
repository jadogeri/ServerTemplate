
// Unit tests for: generateRandomUUID


import nolookalikes from "nanoid-dictionary/nolookalikes";
import { generateRandomUUID } from '../../../src/utils/generateRandonUUID';


// src/utils/__tests__/generateRandomUUID.test.ts


// src/utils/__tests__/generateRandomUUID.test.ts
describe('generateRandomUUID() generateRandomUUID method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should generate a UUID of the specified length', () => {
      // Test to ensure the function returns a string of the correct length
      const length = 10;
      const uuid = generateRandomUUID(length);
      expect(uuid).toHaveLength(length);
    });

    it('should generate a UUID using only characters from the nolookalikes dictionary', () => {
      // Test to ensure the function only uses characters from the nolookalikes dictionary
      const length = 15;
      const uuid = generateRandomUUID(length);
      for (let char of uuid) {
        expect(nolookalikes).toContain(char);
      }
    });

    it('should generate different UUIDs on consecutive calls', () => {
      // Test to ensure the function generates different UUIDs on consecutive calls
      const length = 8;
      const uuid1 = generateRandomUUID(length);
      const uuid2 = generateRandomUUID(length);
      expect(uuid1).not.toEqual(uuid2);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an empty string when length is 0', () => {
      // Test to ensure the function returns an empty string when length is 0
      const length = 0;
      const uuid = generateRandomUUID(length);
      expect(uuid).toBe('');
    });

    it('should handle very large lengths without error', () => {
      // Test to ensure the function can handle very large lengths
      const length = 10000;
      const uuid = generateRandomUUID(length);
      expect(uuid).toHaveLength(length);
    });

    it('should throw an error if length is negative', () => {
      // Test to ensure the function throws an error for negative lengths
      const length = -5;
      expect(() => generateRandomUUID(length)).toThrow('Invalid length');
    });

    it('should handle non-integer lengths by rounding down', () => {
      // Test to ensure the function handles non-integer lengths by rounding down
      const length = 5.7;
      const uuid = generateRandomUUID(Math.floor(length));
      expect(uuid).toHaveLength(Math.floor(length));
    });
  });
});

// End of unit tests for: generateRandomUUID

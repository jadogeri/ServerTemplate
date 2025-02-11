
// Unit tests for: getByToken


import { IAuth } from "../../../src/interfaces/IAuth";
import Auth from "../../../src/models/authModel";
import { getByToken } from '../../../src/services/authService';




// Mock the Auth model
jest.mock("../../../src/models/authModel");

describe('getByToken() getByToken method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Paths', () => {
    it('should return null when no auth object is found for the given token', async () => {
      // Arrange: Set up the mock to return null
      (Auth.findOne as jest.Mock).mockResolvedValue(null);

      // Act: Call the function with a token that does not exist
      const result = await getByToken('nonExistentToken');

      // Assert: Verify that the function returns null
      expect(result).toBeNull();
      expect(Auth.findOne).toHaveBeenCalledWith({ token: 'nonExistentToken' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle an empty token string gracefully', async () => {
      // Arrange: Set up the mock to return null
      (Auth.findOne as jest.Mock).mockResolvedValue(null);

      // Act: Call the function with an empty token
      const result = await getByToken('');

      // Assert: Verify that the function returns null
      expect(result).toBeNull();
      expect(Auth.findOne).toHaveBeenCalledWith({ token: '' });
    });
    it('should handle a very long token string', async () => {
      // Arrange: Set up the mock to return null
      const longToken = 'a'.repeat(1000);
      (Auth.findOne as jest.Mock).mockResolvedValue(null);

      // Act: Call the function with a very long token
      const result = await getByToken(longToken);

      // Assert: Verify that the function returns null
      expect(result).toBeNull();
      expect(Auth.findOne).toHaveBeenCalledWith({ token: longToken });
    });
  });
});

// End of unit tests for: getByToken

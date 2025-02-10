
// Unit tests for: remove


import Auth from "../../../src/models/authModel";
import { remove } from '../../../src/services/authService';




jest.mock("../../../src/models/authModel");

describe('remove() remove method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should successfully delete a document when a valid token is provided', async () => {
      // Arrange
      const token = 'validToken';
      const mockResponse = { _id: '123', token: 'validToken' };
      (Auth.findOneAndDelete as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await remove(token);

      // Assert
      expect(Auth.findOneAndDelete).toHaveBeenCalledWith({ token: token });
      expect(result).toEqual(mockResponse);
    });

    it('should return null if no document is found with the provided token', async () => {
      // Arrange
      const token = 'nonExistentToken';
      (Auth.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await remove(token);

      // Assert
      expect(Auth.findOneAndDelete).toHaveBeenCalledWith({ token: token });
      expect(result).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle an empty string token gracefully', async () => {
      // Arrange
      const token = '';
      (Auth.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await remove(token);

      // Assert
      expect(Auth.findOneAndDelete).toHaveBeenCalledWith({ token: token });
      expect(result).toBeNull();
    });
    it('should handle a token with special characters', async () => {
      // Arrange
      const token = '!@#$%^&*()';
      (Auth.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await remove(token);

      // Assert
      expect(Auth.findOneAndDelete).toHaveBeenCalledWith({ token: token });
      expect(result).toBeNull();
    });

    it('should handle a very long token string', async () => {
      // Arrange
      const token = 'a'.repeat(1000);
      (Auth.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await remove(token);

      // Assert
      expect(Auth.findOneAndDelete).toHaveBeenCalledWith({ token: token });
      expect(result).toBeNull();
    });
  });
});

// End of unit tests for: remove

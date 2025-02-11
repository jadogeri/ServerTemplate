
// Unit tests for: getByUsername


import { IUser } from "../../../src/interfaces/IUser";
import User from "../../../src/models/userModel";
import { getByUsername } from '../../../src/services/userService';




// Mock the User model
jest.mock("../../../src/models/userModel");

describe('getByUsername() getByUsername method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return a user when a valid username is provided', async () => {
      // Arrange
      const mockUser: IUser = { username: 'testuser', email: 'test@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await getByUsername('testuser');

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user is found with the given username', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getByUsername('nonexistentuser');

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: 'nonexistentuser' });
      expect(result).toBeNull();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle an empty string as a username', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getByUsername('');

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: '' });
      expect(result).toBeNull();
    });

    it('should handle a username with special characters', async () => {
      // Arrange
      const specialCharUsername = 'user!@#';
      const mockUser: IUser = { username: specialCharUsername, email: 'special@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await getByUsername(specialCharUsername);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: specialCharUsername });
      expect(result).toEqual(mockUser);
    });

    it('should handle a very long username', async () => {
      // Arrange
      const longUsername = 'a'.repeat(256);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getByUsername(longUsername);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: longUsername });
      expect(result).toBeNull();
    });

    it('should handle a username with mixed case sensitivity', async () => {
      // Arrange
      const mixedCaseUsername = 'TestUser';
      const mockUser: IUser = { username: mixedCaseUsername, email: 'mixedcase@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await getByUsername(mixedCaseUsername);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: mixedCaseUsername });
      expect(result).toEqual(mockUser);
    });
  });
});

// End of unit tests for: getByUsername

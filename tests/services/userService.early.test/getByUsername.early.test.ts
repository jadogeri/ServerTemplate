
// Unit tests for: getByUsername


import User from "../../../src/models/userModel";
import { getByUsername } from '../../../src/services/userService';


// Import necessary modules and dependencies


// Import necessary modules and dependencies
// Mock the User model
jest.mock("../../../src/models/userModel");

describe('getByUsername() getByUsername method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return a user when a valid username is provided', async () => {
      // Arrange: Set up the mock to return a user object
      const mockUser = { username: 'testuser', email: 'test@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act: Call the function with a valid username
      const result = await getByUsername('testuser');

      // Assert: Verify the function returns the expected user object
      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    });

    it('should return null when no user is found with the given username', async () => {
      // Arrange: Set up the mock to return null
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act: Call the function with a username that does not exist
      const result = await getByUsername('nonexistentuser');

      // Assert: Verify the function returns null
      expect(result).toBeNull();
      expect(User.findOne).toHaveBeenCalledWith({ username: 'nonexistentuser' });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle an empty string as a username', async () => {
      // Arrange: Set up the mock to return null
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act: Call the function with an empty string
      const result = await getByUsername('');

      // Assert: Verify the function returns null
      expect(result).toBeNull();
      expect(User.findOne).toHaveBeenCalledWith({ username: '' });
    });

    it('should handle a username with special characters', async () => {
      // Arrange: Set up the mock to return a user object
      const mockUser = { username: 'user!@#$', email: 'special@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act: Call the function with a username containing special characters
      const result = await getByUsername('user!@#$');

      // Assert: Verify the function returns the expected user object
      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ username: 'user!@#$' });
    });

    it('should handle a very long username', async () => {
      // Arrange: Set up the mock to return null
      const longUsername = 'a'.repeat(256);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act: Call the function with a very long username
      const result = await getByUsername(longUsername);

      // Assert: Verify the function returns null
      expect(result).toBeNull();
      expect(User.findOne).toHaveBeenCalledWith({ username: longUsername });
    });
  });
});

// End of unit tests for: getByUsername

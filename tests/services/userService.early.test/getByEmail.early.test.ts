
// Unit tests for: getByEmail


import { IUser } from "../../../src/interfaces/IUser";
import User from "../../../src/models/userModel";
import { getByEmail } from '../../../src/services/userService';




// Mock the User model
jest.mock("../../../src/models/userModel");

describe('getByEmail() getByEmail method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Paths', () => {
    it('should return a user when a user with the given email exists', async () => {
      // Arrange
      const mockUser: IUser = { email: 'test@example.com', username: 'testuser' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await getByEmail('test@example.com');

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user with the given email exists', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getByEmail('nonexistent@example.com');

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
      expect(result).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle an empty email string gracefully', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getByEmail('');

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: '' });
      expect(result).toBeNull();
    });

    it('should handle a null email input gracefully', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getByEmail(null as unknown as string);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: null });
      expect(result).toBeNull();
    });

    it('should handle a very long email string gracefully', async () => {
      // Arrange
      const longEmail = 'a'.repeat(1000) + '@example.com';
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getByEmail(longEmail);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: longEmail });
      expect(result).toBeNull();
    });

    it('should handle special characters in the email', async () => {
      // Arrange
      const specialEmail = 'user+test@example.com';
      const mockUser: IUser = { email: specialEmail, username: 'specialuser' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await getByEmail(specialEmail);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: specialEmail });
      expect(result).toEqual(mockUser);
    });
  });
});

// End of unit tests for: getByEmail

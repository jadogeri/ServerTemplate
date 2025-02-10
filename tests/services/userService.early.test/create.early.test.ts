
// Unit tests for: create


import { IUser } from "../../../src/interfaces/IUser";
import User from "../../../src/models/userModel";
import { create } from '../../../src/services/userService';




// Mock the User model
jest.mock("../../../src/models/userModel");

describe('create() create method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should create a user successfully with all fields provided', async () => {
      // Arrange
      const user: IUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'securepassword',
        phone: '1234567890',
        isEnabled: true,
        failedLogins: 0,
      };
      (User.create as jest.Mock).mockResolvedValue(user);

      // Act
      const result = await create(user);

      // Assert
      expect(User.create).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should create a user successfully with only required fields', async () => {
      // Arrange
      const user: IUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'securepassword',
      };
      (User.create as jest.Mock).mockResolvedValue(user);

      // Act
      const result = await create(user);

      // Assert
      expect(User.create).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle creation of a user with missing optional fields', async () => {
      // Arrange
      const user: IUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'securepassword',
      };
      (User.create as jest.Mock).mockResolvedValue(user);

      // Act
      const result = await create(user);

      // Assert
      expect(User.create).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw an error if User.create fails', async () => {
      // Arrange
      const user: IUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'securepassword',
      };
      const errorMessage = 'Database error';
      (User.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(create(user)).rejects.toThrow(errorMessage);
      expect(User.create).toHaveBeenCalledWith(user);
    });

    it('should handle creation of a user with undefined fields', async () => {
      // Arrange
      const user: IUser = {
        username: undefined,
        email: undefined,
        password: undefined,
      };
      (User.create as jest.Mock).mockResolvedValue(user);

      // Act
      const result = await create(user);

      // Assert
      expect(User.create).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });
});

// End of unit tests for: create

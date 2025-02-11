
// Unit tests for: create


import { IUser } from "../../../src/interfaces/IUser";
import User from "../../../src/models/userModel";
import { create } from '../../../src/services/userService';




// Mock the User model
jest.mock("../../../src/models/userModel");

describe('create() create method', () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should create a user successfully with valid input", async () => {
      // Arrange
      const user: IUser = {
        email: "test@example.com",
        username: "testuser",
        password: "password123",
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
  describe("Edge Cases", () => {
    it("should handle creation with missing optional fields", async () => {
      // Arrange
      const user: IUser = {
        email: "test3@example.com",
        username: "testuser3",
        password: "password123",
      };
      (User.create as jest.Mock).mockResolvedValue(user);

      // Act
      const result = await create(user);

      // Assert
      expect(User.create).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it("should throw an error if User.create fails", async () => {
      // Arrange
      const user: IUser = {
        email: "test4@example.com",
        username: "testuser4",
        password: "password123",
      };
      const errorMessage = "Database error";
      (User.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(create(user)).rejects.toThrow(errorMessage);
    });

    it("should handle creation with a very long username", async () => {
      // Arrange
      const user: IUser = {
        email: "test5@example.com",
        username: "a".repeat(256), // Very long username
        password: "password123",
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

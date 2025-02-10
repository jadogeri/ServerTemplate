
// Unit tests for: getByToken


import mongoose from "mongoose";
import Auth from "../../../src/models/authModel";
import { getByToken } from '../../../src/services/authService';




// Mock the Auth model
jest.mock("../../../src/models/authModel");

describe('getByToken() getByToken method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should return an auth object when a valid token is provided", async () => {
      // Arrange
      const mockToken = "validToken123";
      const mockAuthObject = { id: new mongoose.Types.ObjectId(), token: mockToken };
      (Auth.findOne as jest.Mock).mockResolvedValue(mockAuthObject);

      // Act
      const result = await getByToken(mockToken);

      // Assert
      expect(Auth.findOne).toHaveBeenCalledWith({ token: mockToken });
      expect(result).toEqual(mockAuthObject);
    });

    it("should return null when no auth object is found for the given token", async () => {
      // Arrange
      const mockToken = "nonExistentToken";
      (Auth.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getByToken(mockToken);

      // Assert
      expect(Auth.findOne).toHaveBeenCalledWith({ token: mockToken });
      expect(result).toBeNull();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle an empty token string gracefully", async () => {
      // Arrange
      const mockToken = "";
      (Auth.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getByToken(mockToken);

      // Assert
      expect(Auth.findOne).toHaveBeenCalledWith({ token: mockToken });
      expect(result).toBeNull();
    });

    it("should handle a token with special characters", async () => {
      // Arrange
      const mockToken = "!@#$%^&*()_+";
      const mockAuthObject = { id: new mongoose.Types.ObjectId(), token: mockToken };
      (Auth.findOne as jest.Mock).mockResolvedValue(mockAuthObject);

      // Act
      const result = await getByToken(mockToken);

      // Assert
      expect(Auth.findOne).toHaveBeenCalledWith({ token: mockToken });
      expect(result).toEqual(mockAuthObject);
    });

    it("should handle a very long token string", async () => {
      // Arrange
      const mockToken = "a".repeat(1000);
      const mockAuthObject = { id: new mongoose.Types.ObjectId(), token: mockToken };
      (Auth.findOne as jest.Mock).mockResolvedValue(mockAuthObject);

      // Act
      const result = await getByToken(mockToken);

      // Assert
      expect(Auth.findOne).toHaveBeenCalledWith({ token: mockToken });
      expect(result).toEqual(mockAuthObject);
    });

    it("should throw an error if the database query fails", async () => {
      // Arrange
      const mockToken = "errorToken";
      (Auth.findOne as jest.Mock).mockRejectedValue(new Error("Database query failed"));

      // Act & Assert
      await expect(getByToken(mockToken)).rejects.toThrow("Database query failed");
      expect(Auth.findOne).toHaveBeenCalledWith({ token: mockToken });
    });
  });
});

// End of unit tests for: getByToken

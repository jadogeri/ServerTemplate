
// Unit tests for: create


import mongoose from "mongoose";
import Auth from "../../../src/models/authModel";
import { create } from '../../../src/services/authService';


// Import necessary modules and dependencies


// Import necessary modules and dependencies
// Mock the mongoose module
jest.mock("mongoose");

// Mock the Auth model
jest.mock("../../../src/models/authModel", () => ({
  create: jest.fn(),
}));

// Define a mock interface for IAuth
interface MockIAuth {
  token?: string;
  id: mongoose.Types.ObjectId;
}

// Test suite for the create function
describe('create() create method', () => {
  // Happy path tests
  describe('Happy Paths', () => {
    it('should successfully create an auth document with valid data', async () => {
      // Arrange
      const mockAuth: MockIAuth = {
        token: 'validToken',
        id: new mongoose.Types.ObjectId(),
      } as any;

      const mockCreate = jest.mocked(Auth.create);
      mockCreate.mockResolvedValue(mockAuth as any as never);

      // Act
      const result = await create(mockAuth as any);

      // Assert
      expect(mockCreate).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toEqual(mockAuth);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should handle creation with missing token', async () => {
      // Arrange
      const mockAuth: MockIAuth = {
        id: new mongoose.Types.ObjectId(),
      } as any;

      const mockCreate = jest.mocked(Auth.create);
      mockCreate.mockResolvedValue(mockAuth as any as never);

      // Act
      const result = await create(mockAuth as any);

      // Assert
      expect(mockCreate).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toEqual(mockAuth);
    });

    it('should throw an error if creation fails', async () => {
      // Arrange
      const mockAuth: MockIAuth = {
        token: 'validToken',
        id: new mongoose.Types.ObjectId(),
      } as any;

      const mockCreate = jest.mocked(Auth.create);
      mockCreate.mockRejectedValue(new Error('Creation failed') as never);

      // Act & Assert
      await expect(create(mockAuth as any)).rejects.toThrow('Creation failed');
      expect(mockCreate).toHaveBeenCalledWith(mockAuth as any);
    });
  });
});

// End of unit tests for: create


// Unit tests for: create


import mongoose from "mongoose";
import Auth from "../../../src/models/authModel";
import { create } from '../../../src/services/authService';


// src/services/__tests__/authService.test.ts



// src/services/__tests__/authService.test.ts
// Mocking the IAuth interface
interface MockIAuth {
  token?: string;
  id: mongoose.Types.ObjectId;
}

// Mocking mongoose.Types.ObjectId
jest.mock("mongoose", () => ({
  Types: {
    ObjectId: jest.fn().mockImplementation(() => 'mocked-object-id'),
  },
}));

// Mocking the Auth model
jest.mock("../../../src/models/authModel", () => ({
  create: jest.fn(),
}));

describe('create() create method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Paths', () => {
    it('should successfully create an auth document', async () => {
      // Arrange
      const mockAuth: MockIAuth = {
        token: 'valid-token',
        id: new mongoose.Types.ObjectId() as any,
      };
      const mockCreate = jest.mocked(Auth.create);
      mockCreate.mockResolvedValue(mockAuth as any as never);

      // Act
      const result = await create(mockAuth as any);

      // Assert
      expect(mockCreate).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toEqual(mockAuth);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing token gracefully', async () => {
      // Arrange
      const mockAuth: MockIAuth = {
        id: new mongoose.Types.ObjectId() as any,
      };
      const mockCreate = jest.mocked(Auth.create);
      mockCreate.mockResolvedValue(mockAuth as any as never);

      // Act
      const result = await create(mockAuth as any);

      // Assert
      expect(mockCreate).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toEqual(mockAuth);
    });

    it('should throw an error if Auth.create fails', async () => {
      // Arrange
      const mockAuth: MockIAuth = {
        token: 'valid-token',
        id: new mongoose.Types.ObjectId() as any,
      };
      const mockCreate = jest.mocked(Auth.create);
      mockCreate.mockRejectedValue(new Error('Database error') as never);

      // Act & Assert
      await expect(create(mockAuth as any)).rejects.toThrow('Database error');
      expect(mockCreate).toHaveBeenCalledWith(mockAuth as any);
    });
  });
});

// End of unit tests for: create

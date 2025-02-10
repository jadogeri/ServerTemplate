
// Unit tests for: update


import mongoose from "mongoose";
import Auth from "../../../src/models/authModel";
import { update } from '../../../src/services/authService';




// Mocking the mongoose and Auth dependencies
jest.mock("mongoose");
jest.mock("../../../src/models/authModel");

// MockIAuth interface to simulate IAuth
interface MockIAuth {
  token?: string;
  id: mongoose.Types.ObjectId;
}

// Helper function to create a mock IAuth object
function createMockIAuth(overrides?: Partial<MockIAuth>): MockIAuth {
  return {
    token: 'defaultToken',
    id: new mongoose.Types.ObjectId(),
    ...overrides,
  } as any;
}

describe('update() update method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should update the token for a valid auth object', async () => {
      // Arrange
      const mockAuth = createMockIAuth();
      const updateOneMock = jest.fn().mockResolvedValue({ nModified: 1 });
      (Auth.updateOne as jest.MockedFunction<typeof Auth.updateOne>) = updateOneMock;

      // Act
      const result = await update(mockAuth as any);

      // Assert
      expect(updateOneMock).toHaveBeenCalledWith(
        { id: mockAuth.id },
        { $set: { token: mockAuth.token } },
        { upsert: true }
      );
      expect(result).toEqual({ nModified: 1 });
    });

    it('should upsert a new auth object if it does not exist', async () => {
      // Arrange
      const mockAuth = createMockIAuth();
      const updateOneMock = jest.fn().mockResolvedValue({ upserted: 1 });
      (Auth.updateOne as jest.MockedFunction<typeof Auth.updateOne>) = updateOneMock;

      // Act
      const result = await update(mockAuth as any);

      // Assert
      expect(updateOneMock).toHaveBeenCalledWith(
        { id: mockAuth.id },
        { $set: { token: mockAuth.token } },
        { upsert: true }
      );
      expect(result).toEqual({ upserted: 1 });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle missing token gracefully', async () => {
      // Arrange
      const mockAuth = createMockIAuth({ token: undefined });
      const updateOneMock = jest.fn().mockResolvedValue({ nModified: 0 });
      (Auth.updateOne as jest.MockedFunction<typeof Auth.updateOne>) = updateOneMock;

      // Act
      const result = await update(mockAuth as any);

      // Assert
      expect(updateOneMock).toHaveBeenCalledWith(
        { id: mockAuth.id },
        { $set: { token: undefined } },
        { upsert: true }
      );
      expect(result).toEqual({ nModified: 0 });
    });

    it('should handle invalid ObjectId', async () => {
      // Arrange
      const mockAuth = createMockIAuth({ id: 'invalidObjectId' as any });
      const updateOneMock = jest.fn().mockRejectedValue(new Error('Invalid ObjectId'));
      (Auth.updateOne as jest.MockedFunction<typeof Auth.updateOne>) = updateOneMock;

      // Act & Assert
      await expect(update(mockAuth as any)).rejects.toThrow('Invalid ObjectId');
    });
  });
});

// End of unit tests for: update

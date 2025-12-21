
import AuthRepository from '../AuthRepository';


// AuthRepository.remove.spec.ts


// AuthRepository.remove.spec.ts
// Manual mock for IAuth interface
interface MockIAuth {
  token?: string;
  id?: string; // Simulate ObjectId as string for testing
}

// Manual mock for mongoose ObjectId class
class MockObjectId {
  toHexString = jest.fn().mockReturnValue('mockedObjectIdString');
}

// Manual mock for mongoose Model
class Mockmongoose {
  public findOneAndDelete = jest.mocked(jest.fn());
}

// All tests for remove are organized under a single describe block
describe('AuthRepository.remove() remove method', () => {
  let mockModel: Mockmongoose;
  let authRepository: AuthRepository;

  beforeEach(() => {
    // Initialize a fresh mock model before each test
    mockModel = new Mockmongoose();
    authRepository = new AuthRepository(mockModel as any);
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should delete a user by token and return the deleted document', async () => {
      // This test ensures that remove deletes a user by token and returns the deleted document
      const mockAuth: MockIAuth = { token: 'validToken' };
      const mockDeletedDoc = { token: 'validToken', id: 'userId123' };

      mockModel.findOneAndDelete.mockResolvedValue(mockDeletedDoc as any as never);

      const result = await authRepository.remove(mockAuth as any);

      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockDeletedDoc as any);
    });

    it('should delete a user by id and return the deleted document', async () => {
      // This test ensures that remove deletes a user by id and returns the deleted document
      const mockObjectId = new MockObjectId();
      const mockAuth: MockIAuth = { id: mockObjectId.toHexString() };
      const mockDeletedDoc = { token: 'anotherToken', id: mockObjectId.toHexString() };

      mockModel.findOneAndDelete.mockResolvedValue(mockDeletedDoc as any as never);

      const result = await authRepository.remove(mockAuth as any);

      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockDeletedDoc as any);
    });

    it('should delete a user with both token and id and return the deleted document', async () => {
      // This test ensures that remove deletes a user when both token and id are provided
      const mockObjectId = new MockObjectId();
      const mockAuth: MockIAuth = { token: 'comboToken', id: mockObjectId.toHexString() };
      const mockDeletedDoc = { token: 'comboToken', id: mockObjectId.toHexString() };

      mockModel.findOneAndDelete.mockResolvedValue(mockDeletedDoc as any as never);

      const result = await authRepository.remove(mockAuth as any);

      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockDeletedDoc as any);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return null if no user matches the criteria', async () => {
      // This test ensures that remove returns null if no user matches the criteria
      const mockAuth: MockIAuth = { token: 'nonExistentToken' };

      mockModel.findOneAndDelete.mockResolvedValue(null);

      const result = await authRepository.remove(mockAuth as any);

      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBeNull();
    });

    it('should handle empty auth object and return null', async () => {
      // This test ensures that remove handles an empty auth object gracefully
      const mockAuth: MockIAuth = {};

      mockModel.findOneAndDelete.mockResolvedValue(null);

      const result = await authRepository.remove(mockAuth as any);

      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBeNull();
    });

    it('should throw an error if the database operation fails', async () => {
      // This test ensures that remove throws an error if the database operation fails
      const mockAuth: MockIAuth = { token: 'errorToken' };
      const mockError = new Error('Database failure');

      mockModel.findOneAndDelete.mockRejectedValue(mockError as never);

      await expect(authRepository.remove(mockAuth as any)).rejects.toThrow('Database failure');
      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith(mockAuth as any);
    });

    it('should handle auth object with unexpected properties', async () => {
      // This test ensures that remove handles auth objects with unexpected properties
      const mockAuth: MockIAuth & { extra?: string } = { token: 'token', extra: 'unexpected' };
      const mockDeletedDoc = { token: 'token', extra: 'unexpected' };

      mockModel.findOneAndDelete.mockResolvedValue(mockDeletedDoc as any as never);

      const result = await authRepository.remove(mockAuth as any);

      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockDeletedDoc as any);
    });

    it('should handle auth object with id as a non-string value', async () => {
      // This test ensures that remove handles auth objects with id as a non-string value
      const mockAuth: MockIAuth = { id: 12345 as any };
      const mockDeletedDoc = { id: 12345 };

      mockModel.findOneAndDelete.mockResolvedValue(mockDeletedDoc as any as never);

      const result = await authRepository.remove(mockAuth as any);

      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockDeletedDoc as any);
    });
  });
});

import { IAuthRepository } from '../../interfaces/IAuthRepository';
import AuthService from '../AuthService';


// AuthService.removeByUserID.spec.ts
// Manual mock for mongoose.Types.ObjectId
class MockObjectId {
  public _id: string = '507f1f77bcf86cd799439011';
  toHexString(): string {
    return this._id;
  }
}


// Manual mock for IAuthRepository
const mockAuthRepository: jest.Mocked<IAuthRepository> = {
  findByUserId: jest.fn(),
  findByToken: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('AuthService.removeByUserID() removeByUserID method', () => {
  let authService: AuthService;
  let mockUserId: MockObjectId;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    authService = new AuthService(mockAuthRepository as any);
    mockUserId = new MockObjectId();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should call authRepository.remove with correct IAuth object and return its result', async () => {
      // This test ensures that removeByUserID calls remove with the correct IAuth object and returns the result.
      const expectedResult = { success: true, deletedCount: 1 };
      jest.mocked(mockAuthRepository.remove).mockResolvedValue(expectedResult as any as never);

      const result = await authService.removeByUserID(mockUserId as any);

      expect(mockAuthRepository.remove).toHaveBeenCalledTimes(1);
      expect(mockAuthRepository.remove).toHaveBeenCalledWith({ id: mockUserId } as any);
      expect(result).toBe(expectedResult);
    });

    it('should work with a userID that has a different _id value', async () => {
      // This test ensures that removeByUserID works with different ObjectId values.
      const anotherUserId = new MockObjectId();
      anotherUserId._id = '1234567890abcdef12345678';
      const expectedResult = { success: true, deletedCount: 1 };
      jest.mocked(mockAuthRepository.remove).mockResolvedValue(expectedResult as any as never);

      const result = await authService.removeByUserID(anotherUserId as any);

      expect(mockAuthRepository.remove).toHaveBeenCalledWith({ id: anotherUserId } as any);
      expect(result).toBe(expectedResult);
    });

    it('should propagate the result from authRepository.remove if it returns a custom object', async () => {
      // This test ensures that any custom object returned by remove is propagated.
      const customResult = { status: 'removed', user: 'testuser' };
      jest.mocked(mockAuthRepository.remove).mockResolvedValue(customResult as any as never);

      const result = await authService.removeByUserID(mockUserId as any);

      expect(result).toBe(customResult);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle when authRepository.remove returns null', async () => {
      // This test ensures that removeByUserID correctly returns null if remove returns null.
      jest.mocked(mockAuthRepository.remove).mockResolvedValue(null);

      const result = await authService.removeByUserID(mockUserId as any);

      expect(result).toBeNull();
    });

    it('should handle when authRepository.remove throws an error', async () => {
      // This test ensures that removeByUserID propagates errors thrown by remove.
      const error = new Error('Database error');
      jest.mocked(mockAuthRepository.remove).mockRejectedValue(error as never);

      await expect(authService.removeByUserID(mockUserId as any)).rejects.toThrow('Database error');
    });

    it('should handle userID with unusual but valid structure', async () => {
      // This test ensures that removeByUserID works with an ObjectId that has extra properties.
      const weirdUserId = new MockObjectId();
      (weirdUserId as any).extra = 'extraProperty';
      const expectedResult = { success: true };
      jest.mocked(mockAuthRepository.remove).mockResolvedValue(expectedResult as any as never);

      const result = await authService.removeByUserID(weirdUserId as any);

      expect(mockAuthRepository.remove).toHaveBeenCalledWith({ id: weirdUserId } as any);
      expect(result).toBe(expectedResult);
    });

    it('should handle when userID is an empty ObjectId instance', async () => {
      // This test ensures that removeByUserID works with an ObjectId with an empty _id string.
      const emptyUserId = new MockObjectId();
      emptyUserId._id = '';
      const expectedResult = { success: false, deletedCount: 0 };
      jest.mocked(mockAuthRepository.remove).mockResolvedValue(expectedResult as any as never);

      const result = await authService.removeByUserID(emptyUserId as any);

      expect(mockAuthRepository.remove).toHaveBeenCalledWith({ id: emptyUserId } as any);
      expect(result).toBe(expectedResult);
    });

    it('should handle when userID is a very long string', async () => {
      // This test ensures that removeByUserID works with an ObjectId with a very long _id string.
      const longUserId = new MockObjectId();
      longUserId._id = 'a'.repeat(100);
      const expectedResult = { success: true, deletedCount: 1 };
      jest.mocked(mockAuthRepository.remove).mockResolvedValue(expectedResult as any as never);

      const result = await authService.removeByUserID(longUserId as any);

      expect(mockAuthRepository.remove).toHaveBeenCalledWith({ id: longUserId } as any);
      expect(result).toBe(expectedResult);
    });
  });
});
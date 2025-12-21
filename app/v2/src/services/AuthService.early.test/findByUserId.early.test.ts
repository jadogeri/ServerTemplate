
import { IAuth } from '../../interfaces/IAuth';
import { IAuthRepository } from '../../interfaces/IAuthRepository';
import AuthService from '../AuthService';


// app/v2/src/services/AuthService.findByUserId.spec.ts
// Manual mock for mongoose and ObjectId
class MockObjectId {
  public id: string = '507f1f77bcf86cd799439011';
  toHexString = jest.fn().mockReturnValue(this.id);
}


// Manual mock for IAuth
class MockIAuth implements IAuth {
  public token: string = 'mock-token';
  public id: MockObjectId = new MockObjectId();
}

// Manual mock for IAuthRepository
const mockAuthRepository = {
  findByUserId: jest.fn(),
  findByToken: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
} as unknown as jest.Mocked<IAuthRepository>;

describe('AuthService.findByUserId() findByUserId method', () => {
  let authService: AuthService;
  let mockUserId: MockObjectId;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    authService = new AuthService(mockAuthRepository as any);
    mockUserId = new MockObjectId();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return an IAuth object when the user exists', async () => {
      // This test ensures that a valid IAuth object is returned for an existing user.
      const mockAuth = new MockIAuth();
      jest.mocked(mockAuthRepository.findByUserId).mockResolvedValue(mockAuth as any as never);

      const result = await authService.findByUserId(mockUserId as any);

      expect(mockAuthRepository.findByUserId).toHaveBeenCalledWith(mockUserId as any);
      expect(result).toBe(mockAuth as any);
    });

    it('should return an IAuth object with expected properties', async () => {
      // This test ensures that the returned IAuth object contains the expected properties.
      const mockAuth = new MockIAuth();
      mockAuth.token = 'expected-token';
      mockAuth.id = mockUserId;
      jest.mocked(mockAuthRepository.findByUserId).mockResolvedValue(mockAuth as any as never);

      const result = await authService.findByUserId(mockUserId as any);

      expect(result).toHaveProperty('token', 'expected-token');
      expect(result).toHaveProperty('id', mockUserId);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return null if the user does not exist', async () => {
      // This test ensures that null is returned when no user is found.
      jest.mocked(mockAuthRepository.findByUserId).mockResolvedValue(null);

      const result = await authService.findByUserId(mockUserId as any);

      expect(mockAuthRepository.findByUserId).toHaveBeenCalledWith(mockUserId as any);
      expect(result).toBeNull();
    });

    it('should propagate errors thrown by the repository', async () => {
      // This test ensures that errors from the repository are propagated.
      const error = new Error('Repository failure');
      jest.mocked(mockAuthRepository.findByUserId).mockRejectedValue(error as never);

      await expect(authService.findByUserId(mockUserId as any)).rejects.toThrow('Repository failure');
      expect(mockAuthRepository.findByUserId).toHaveBeenCalledWith(mockUserId as any);
    });

    it('should handle userID with unusual but valid ObjectId values', async () => {
      // This test ensures that the method works with unusual but valid ObjectId values.
      const unusualObjectId = new MockObjectId();
      unusualObjectId.id = '000000000000000000000001';
      const mockAuth = new MockIAuth();
      jest.mocked(mockAuthRepository.findByUserId).mockResolvedValue(mockAuth as any as never);

      const result = await authService.findByUserId(unusualObjectId as any);

      expect(mockAuthRepository.findByUserId).toHaveBeenCalledWith(unusualObjectId as any);
      expect(result).toBe(mockAuth as any);
    });
  });
});
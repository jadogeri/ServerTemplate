
import { IAuthRepository } from '../../interfaces/IAuthRepository';
import AuthService from '../AuthService';


// app/v2/src/services/AuthService.create.spec.ts
// Manual mock for mongoose.Types.ObjectId
class MockObjectId {
  public _id: string = 'mocked-object-id';
  toHexString(): string {
    return this._id;
  }
}

// Manual mock for IAuth
interface MockIAuth {
  id?: MockObjectId;
  token?: string;
}

// Manual mock for IAuthRepository
const mockAuthRepository: jest.Mocked<IAuthRepository> = {
  findByUserId: jest.fn(),
  findByToken: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  // removeByUserID is not part of IAuthRepository, so not included
};

describe('AuthService.create() create method', () => {
  let authService: AuthService;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    authService = new AuthService(mockAuthRepository as any);
  });

  // Happy Path Tests
  describe('Happy paths', () => {
    it('should create an auth record with valid userID and accessToken', async () => {
      // This test aims to verify that create calls repository with correct IAuth object and returns its result.
      const mockUserId = new MockObjectId();
      const mockAccessToken = 'valid-access-token';
      const expectedAuth: MockIAuth = {
        id: mockUserId,
        token: mockAccessToken,
      };

      jest.mocked(mockAuthRepository.create).mockResolvedValue(expectedAuth as any as never);

      const result = await authService.create(mockUserId as any, mockAccessToken);

      expect(mockAuthRepository.create).toHaveBeenCalledWith(expectedAuth as any);
      expect(result).toBe(expectedAuth as any);
    });

    it('should handle different valid ObjectId and token values', async () => {
      // This test aims to verify that create works with different valid userID and token values.
      const mockUserId = new MockObjectId();
      mockUserId._id = 'another-object-id';
      const mockAccessToken = 'another-token-123';
      const expectedAuth: MockIAuth = {
        id: mockUserId,
        token: mockAccessToken,
      };

      jest.mocked(mockAuthRepository.create).mockResolvedValue(expectedAuth as any as never);

      const result = await authService.create(mockUserId as any, mockAccessToken);

      expect(mockAuthRepository.create).toHaveBeenCalledWith(expectedAuth as any);
      expect(result).toBe(expectedAuth as any);
    });

    it('should return whatever the repository returns', async () => {
      // This test aims to verify that the return value from repository is passed through.
      const mockUserId = new MockObjectId();
      const mockAccessToken = 'token';
      const repositoryReturn = { some: 'value', id: mockUserId, token: mockAccessToken };

      jest.mocked(mockAuthRepository.create).mockResolvedValue(repositoryReturn as any as never);

      const result = await authService.create(mockUserId as any, mockAccessToken);

      expect(result).toBe(repositoryReturn as any);
    });
  });

  // Edge Case Tests
  describe('Edge cases', () => {
    it('should handle empty string as accessToken', async () => {
      // This test aims to verify that create works when accessToken is an empty string.
      const mockUserId = new MockObjectId();
      const mockAccessToken = '';
      const expectedAuth: MockIAuth = {
        id: mockUserId,
        token: mockAccessToken,
      };

      jest.mocked(mockAuthRepository.create).mockResolvedValue(expectedAuth as any as never);

      const result = await authService.create(mockUserId as any, mockAccessToken);

      expect(mockAuthRepository.create).toHaveBeenCalledWith(expectedAuth as any);
      expect(result).toBe(expectedAuth as any);
    });

    it('should handle very long accessToken string', async () => {
      // This test aims to verify that create works with a very long token string.
      const mockUserId = new MockObjectId();
      const mockAccessToken = 'a'.repeat(1000);
      const expectedAuth: MockIAuth = {
        id: mockUserId,
        token: mockAccessToken,
      };

      jest.mocked(mockAuthRepository.create).mockResolvedValue(expectedAuth as any as never);

      const result = await authService.create(mockUserId as any, mockAccessToken);

      expect(mockAuthRepository.create).toHaveBeenCalledWith(expectedAuth as any);
      expect(result).toBe(expectedAuth as any);
    });

    it('should handle ObjectId with unusual _id value', async () => {
      // This test aims to verify that create works with an ObjectId with an unusual value.
      const mockUserId = new MockObjectId();
      mockUserId._id = '!!!@@@###';
      const mockAccessToken = 'token';
      const expectedAuth: MockIAuth = {
        id: mockUserId,
        token: mockAccessToken,
      };

      jest.mocked(mockAuthRepository.create).mockResolvedValue(expectedAuth as any as never);

      const result = await authService.create(mockUserId as any, mockAccessToken);

      expect(mockAuthRepository.create).toHaveBeenCalledWith(expectedAuth as any);
      expect(result).toBe(expectedAuth as any);
    });

    it('should propagate errors thrown by repository', async () => {
      // This test aims to verify that errors thrown by repository are propagated.
      const mockUserId = new MockObjectId();
      const mockAccessToken = 'token';
      const error = new Error('Repository error');

      jest.mocked(mockAuthRepository.create).mockRejectedValue(error as never);

      await expect(authService.create(mockUserId as any, mockAccessToken)).rejects.toThrow('Repository error');
      expect(mockAuthRepository.create).toHaveBeenCalledWith({
        id: mockUserId,
        token: mockAccessToken,
      } as any);
    });
  });
});
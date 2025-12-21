
import { IAuthRepository } from '../../interfaces/IAuthRepository';
import AuthService from '../AuthService';


// AuthService.update.spec.ts
// Manual mock for mongoose.Types.ObjectId
class MockObjectId {
  public _id: string = 'mocked-object-id';
  toHexString(): string {
    return this._id;
  }
}

// Manual mock for mongoose


describe('AuthService.update() update method', () => {
  let mockAuthRepository: jest.Mocked<IAuthRepository>;
  let authService: AuthService;
  let mockUserId: MockObjectId;
  let mockAccessToken: string;

  beforeEach(() => {
    // Create a manual mock for IAuthRepository
    mockAuthRepository = {
      findByUserId: jest.fn(),
      findByToken: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<IAuthRepository>;

    authService = new AuthService(mockAuthRepository as any);
    mockUserId = new MockObjectId() as any;
    mockAccessToken = 'mocked-access-token';
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should update the authRepository with correct IAuth object and return the result', async () => {
      // This test ensures that update calls the repository with the correct object and returns its result.
      const expectedResult = { success: true, updated: true } as any;
      jest.mocked(mockAuthRepository.update).mockResolvedValue(expectedResult as any as never);

      const result = await authService.update(mockUserId as any, mockAccessToken);

      expect(mockAuthRepository.update).toHaveBeenCalledTimes(1);
      expect(mockAuthRepository.update).toHaveBeenCalledWith({
        id: mockUserId,
        token: mockAccessToken,
      } as any);
      expect(result).toBe(expectedResult);
    });

    it('should allow updating with a different valid ObjectId and token', async () => {
      // This test checks that the method works with different valid inputs.
      const anotherUserId = new MockObjectId() as any;
      anotherUserId._id = 'another-mocked-object-id';
      const anotherToken = 'another-token';
      const expectedResult = { updated: true, user: 'another' } as any;
      jest.mocked(mockAuthRepository.update).mockResolvedValue(expectedResult as any as never);

      const result = await authService.update(anotherUserId as any, anotherToken);

      expect(mockAuthRepository.update).toHaveBeenCalledWith({
        id: anotherUserId,
        token: anotherToken,
      } as any);
      expect(result).toBe(expectedResult);
    });

    it('should propagate the repository result even if it is a primitive value', async () => {
      // This test ensures that primitive values returned by the repository are propagated.
      jest.mocked(mockAuthRepository.update).mockResolvedValue(1);

      const result = await authService.update(mockUserId as any, mockAccessToken);

      expect(result).toBe(1);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle empty string as accessToken', async () => {
      // This test checks that an empty string token is passed through.
      const expectedResult = { updated: true } as any;
      jest.mocked(mockAuthRepository.update).mockResolvedValue(expectedResult as any as never);

      const result = await authService.update(mockUserId as any, '');

      expect(mockAuthRepository.update).toHaveBeenCalledWith({
        id: mockUserId,
        token: '',
      } as any);
      expect(result).toBe(expectedResult);
    });

    it('should handle very long accessToken strings', async () => {
      // This test checks that very long tokens are handled.
      const longToken = 'a'.repeat(10000);
      const expectedResult = { updated: true } as any;
      jest.mocked(mockAuthRepository.update).mockResolvedValue(expectedResult as any as never);

      const result = await authService.update(mockUserId as any, longToken);

      expect(mockAuthRepository.update).toHaveBeenCalledWith({
        id: mockUserId,
        token: longToken,
      } as any);
      expect(result).toBe(expectedResult);
    });

    it('should handle ObjectId with unusual string value', async () => {
      // This test checks that ObjectId with an unusual value is passed through.
      const weirdUserId = new MockObjectId() as any;
      weirdUserId._id = '!@#$%^&*()_+';
      const expectedResult = { updated: true } as any;
      jest.mocked(mockAuthRepository.update).mockResolvedValue(expectedResult as any as never);

      const result = await authService.update(weirdUserId as any, mockAccessToken);

      expect(mockAuthRepository.update).toHaveBeenCalledWith({
        id: weirdUserId,
        token: mockAccessToken,
      } as any);
      expect(result).toBe(expectedResult);
    });

    it('should propagate errors thrown by the repository', async () => {
      // This test ensures that errors from the repository are not swallowed.
      const error = new Error('Repository failure');
      jest.mocked(mockAuthRepository.update).mockRejectedValue(error as never);

      await expect(authService.update(mockUserId as any, mockAccessToken)).rejects.toThrow('Repository failure');
    });

    it('should handle repository returning undefined', async () => {
      // This test checks that undefined is propagated if returned by the repository.
      jest.mocked(mockAuthRepository.update).mockResolvedValue(undefined);

      const result = await authService.update(mockUserId as any, mockAccessToken);

      expect(result).toBeUndefined();
    });

    it('should handle repository returning an empty object', async () => {
      // This test checks that an empty object is propagated if returned by the repository.
      jest.mocked(mockAuthRepository.update).mockResolvedValue({} as any as never);

      const result = await authService.update(mockUserId as any, mockAccessToken);

      expect(result).toEqual({});
    });
  });
});
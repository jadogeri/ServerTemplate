
import AuthRepository from '../AuthRepository';


// app/v2/src/repositories/AuthRepository.findByToken.spec.ts
// Manual mock for mongoose.Types.ObjectId
class MockObjectId {
  public id: string = 'mock-object-id';
  toHexString(): string {
    return this.id;
  }
}

// Manual mock for IAuth
interface MockIAuth {
  token?: string;
  id?: MockObjectId;
}

// Manual mock for mongoose.Model
class Mockmongoose {
  public findOne = jest.fn();
}

describe('AuthRepository.findByToken() findByToken method', () => {
  let mockAuthModel: Mockmongoose;
  let authRepository: AuthRepository;

  beforeEach(() => {
    mockAuthModel = new Mockmongoose();
    authRepository = new AuthRepository(mockAuthModel as any);
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return the auth record when a valid token is provided', async () => {
      // This test ensures that a valid token returns the expected auth record.
      const expectedAuth: MockIAuth = {
        token: 'valid-token',
        id: new MockObjectId(),
      };
      jest.mocked(mockAuthModel.findOne).mockResolvedValue(expectedAuth as any);

      const result = await authRepository.findByToken('valid-token');
      expect(mockAuthModel.findOne).toHaveBeenCalledWith({ token: 'valid-token' });
      expect(result).toEqual(expectedAuth as any);
    });

    it('should call findOne with the correct token value', async () => {
      // This test ensures that findOne is called with the correct query object.
      jest.mocked(mockAuthModel.findOne).mockResolvedValue({ token: 'some-token' } as any);

      await authRepository.findByToken('some-token');
      expect(mockAuthModel.findOne).toHaveBeenCalledWith({ token: 'some-token' });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return null if no auth record is found for the token', async () => {
      // This test ensures that if no record is found, null is returned.
      jest.mocked(mockAuthModel.findOne).mockResolvedValue(null as any);

      const result = await authRepository.findByToken('non-existent-token');
      expect(mockAuthModel.findOne).toHaveBeenCalledWith({ token: 'non-existent-token' });
      expect(result).toBeNull();
    });

    it('should handle empty string as token and return null', async () => {
      // This test ensures that an empty string token returns null.
      jest.mocked(mockAuthModel.findOne).mockResolvedValue(null as any);

      const result = await authRepository.findByToken('');
      expect(mockAuthModel.findOne).toHaveBeenCalledWith({ token: '' });
      expect(result).toBeNull();
    });

    it('should handle tokens with special characters', async () => {
      // This test ensures that tokens with special characters are handled correctly.
      const specialToken = '!@#$%^&*()_+-=';
      const expectedAuth: MockIAuth = {
        token: specialToken,
        id: new MockObjectId(),
      };
      jest.mocked(mockAuthModel.findOne).mockResolvedValue(expectedAuth as any);

      const result = await authRepository.findByToken(specialToken);
      expect(mockAuthModel.findOne).toHaveBeenCalledWith({ token: specialToken });
      expect(result).toEqual(expectedAuth as any);
    });

    it('should propagate errors thrown by the authModel.findOne', async () => {
      // This test ensures that errors from findOne are propagated.
      const error = new Error('Database error');
      jest.mocked(mockAuthModel.findOne).mockRejectedValue(error as never);

      await expect(authRepository.findByToken('error-token')).rejects.toThrow('Database error');
      expect(mockAuthModel.findOne).toHaveBeenCalledWith({ token: 'error-token' });
    });

    it('should handle very long token strings', async () => {
      // This test ensures that very long token strings are handled.
      const longToken = 'a'.repeat(1024);
      const expectedAuth: MockIAuth = {
        token: longToken,
        id: new MockObjectId(),
      };
      jest.mocked(mockAuthModel.findOne).mockResolvedValue(expectedAuth as any);

      const result = await authRepository.findByToken(longToken);
      expect(mockAuthModel.findOne).toHaveBeenCalledWith({ token: longToken });
      expect(result).toEqual(expectedAuth as any);
    });
  });
});
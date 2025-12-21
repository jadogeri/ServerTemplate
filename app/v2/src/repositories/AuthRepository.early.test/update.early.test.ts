
import AuthRepository from '../AuthRepository';


// AuthRepository.update.spec.ts


// AuthRepository.update.spec.ts
// Manual mock for ObjectId
class MockObjectId {
  // Simulate ObjectId methods if needed
  toHexString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');
}
const mockObjectId = new MockObjectId() as unknown as jest.Mocked<MockObjectId>;

// Manual mock for IAuth
interface MockIAuth {
  id?: MockObjectId;
  token?: string;
}

// Manual mock for mongoose.Model<IAuth>
class Mockmongoose {
  public updateOne = jest.fn();
}
const mockAuthModel = new Mockmongoose() as any;

// All tests for update are organized under a single describe block
describe('AuthRepository.update() update method', () => {
  let authRepository: AuthRepository;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    authRepository = new AuthRepository(mockAuthModel as any);
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should update an existing user document with valid id and token', async () => {
      // This test ensures that updateOne is called with correct filter, update, and upsert options
      const mockAuth: MockIAuth = {
        id: mockObjectId as any,
        token: 'valid-token',
      };

      // Simulate updateOne resolves to a result object
      jest.mocked(mockAuthModel.updateOne).mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
      } as any as never);

      const result = await authRepository.update(mockAuth as any);

      expect(mockAuthModel.updateOne).toHaveBeenCalledWith(
        { id: mockAuth.id },
        { $set: { token: mockAuth.token } },
        { upsert: true }
      );
      expect(result).toEqual({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
      });
    });

    it('should create a new user document if user does not exist (upsert)', async () => {
      // This test ensures that upsert works and returns upsertedCount > 0
      const mockAuth: MockIAuth = {
        id: mockObjectId as any,
        token: 'new-token',
      };

      jest.mocked(mockAuthModel.updateOne).mockResolvedValue({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        upsertedId: mockObjectId,
      } as any as never);

      const result = await authRepository.update(mockAuth as any);

      expect(mockAuthModel.updateOne).toHaveBeenCalledWith(
        { id: mockAuth.id },
        { $set: { token: mockAuth.token } },
        { upsert: true }
      );
      expect(result).toEqual({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        upsertedId: mockObjectId,
      });
    });

    it('should update when token is an empty string', async () => {
      // This test ensures that an empty string token is handled
      const mockAuth: MockIAuth = {
        id: mockObjectId as any,
        token: '',
      };

      jest.mocked(mockAuthModel.updateOne).mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
      } as any as never);

      const result = await authRepository.update(mockAuth as any);

      expect(mockAuthModel.updateOne).toHaveBeenCalledWith(
        { id: mockAuth.id },
        { $set: { token: mockAuth.token } },
        { upsert: true }
      );
      expect(result).toEqual({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should update when token is undefined', async () => {
      // This test ensures that undefined token is handled
      const mockAuth: MockIAuth = {
        id: mockObjectId as any,
        // token is undefined
      };

      jest.mocked(mockAuthModel.updateOne).mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
      } as any as never);

      const result = await authRepository.update(mockAuth as any);

      expect(mockAuthModel.updateOne).toHaveBeenCalledWith(
        { id: mockAuth.id },
        { $set: { token: undefined } },
        { upsert: true }
      );
      expect(result).toEqual({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
      });
    });

    it('should update when id is missing (undefined)', async () => {
      // This test ensures that undefined id is handled
      const mockAuth: MockIAuth = {
        // id is undefined
        token: 'token-without-id',
      };

      jest.mocked(mockAuthModel.updateOne).mockResolvedValue({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        upsertedId: undefined,
      } as any as never);

      const result = await authRepository.update(mockAuth as any);

      expect(mockAuthModel.updateOne).toHaveBeenCalledWith(
        { id: undefined },
        { $set: { token: mockAuth.token } },
        { upsert: true }
      );
      expect(result).toEqual({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        upsertedId: undefined,
      });
    });

    it('should propagate errors thrown by updateOne', async () => {
      // This test ensures that errors from updateOne are thrown
      const mockAuth: MockIAuth = {
        id: mockObjectId as any,
        token: 'error-token',
      };

      const error = new Error('Mongoose update error');
      jest.mocked(mockAuthModel.updateOne).mockRejectedValue(error as never);

      await expect(authRepository.update(mockAuth as any)).rejects.toThrow('Mongoose update error');
      expect(mockAuthModel.updateOne).toHaveBeenCalledWith(
        { id: mockAuth.id },
        { $set: { token: mockAuth.token } },
        { upsert: true }
      );
    });

    it('should update when both id and token are undefined', async () => {
      // This test ensures that both undefined id and token are handled
      const mockAuth: MockIAuth = {
        // id: undefined,
        // token: undefined,
      };

      jest.mocked(mockAuthModel.updateOne).mockResolvedValue({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        upsertedId: undefined,
      } as any as never);

      const result = await authRepository.update(mockAuth as any);

      expect(mockAuthModel.updateOne).toHaveBeenCalledWith(
        { id: undefined },
        { $set: { token: undefined } },
        { upsert: true }
      );
      expect(result).toEqual({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        upsertedId: undefined,
      });
    });
  });
});

import { Model } from "mongoose";
import AuthRepository from '../AuthRepository';


// AuthRepository.create.spec.ts


// AuthRepository.create.spec.ts
// Manual mock for mongoose.Types.ObjectId
class MockObjectId {
  private _id: string = 'mocked-object-id';
  toHexString(): string {
    return this._id;
  }
}

// Manual mock for IAuth
interface MockIAuth {
  token?: string;
  id?: MockObjectId;
}

// Manual mock for mongoose

// Helper to create a mock Model<IAuth>
function createMockAuthModel() {
  return {
    create: jest.fn(),
  } as unknown as jest.Mocked<Model<MockIAuth>>;
}

describe('AuthRepository.create() create method', () => {
  // Happy Path Tests
  describe('Happy paths', () => {
    it('should create a user with valid token and id', async () => {
      // This test ensures that a valid user is created and returned as expected.
      const mockAuth: MockIAuth = {
        token: 'valid-token',
        id: new MockObjectId(),
      };
      const mockCreatedAuth: MockIAuth = {
        token: 'valid-token',
        id: new MockObjectId(),
      };
      const mockAuthModel = createMockAuthModel();
      jest.mocked(mockAuthModel.create).mockResolvedValue(mockCreatedAuth as any as never);

      const repo = new AuthRepository(mockAuthModel as any);

      const result = await repo.create(mockAuth as any);

      expect(mockAuthModel.create).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockCreatedAuth as any);
    });

    it('should create a user with only token (id missing)', async () => {
      // This test ensures that a user can be created with only a token and no id.
      const mockAuth: MockIAuth = {
        token: 'token-only',
      };
      const mockCreatedAuth: MockIAuth = {
        token: 'token-only',
      };
      const mockAuthModel = createMockAuthModel();
      jest.mocked(mockAuthModel.create).mockResolvedValue(mockCreatedAuth as any as never);

      const repo = new AuthRepository(mockAuthModel as any);

      const result = await repo.create(mockAuth as any);

      expect(mockAuthModel.create).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockCreatedAuth as any);
    });

    it('should create a user with only id (token missing)', async () => {
      // This test ensures that a user can be created with only an id and no token.
      const mockAuth: MockIAuth = {
        id: new MockObjectId(),
      };
      const mockCreatedAuth: MockIAuth = {
        id: new MockObjectId(),
      };
      const mockAuthModel = createMockAuthModel();
      jest.mocked(mockAuthModel.create).mockResolvedValue(mockCreatedAuth as any as never);

      const repo = new AuthRepository(mockAuthModel as any);

      const result = await repo.create(mockAuth as any);

      expect(mockAuthModel.create).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockCreatedAuth as any);
    });

    it('should create a user with empty object (no token, no id)', async () => {
      // This test ensures that a user can be created with an empty object.
      const mockAuth: MockIAuth = {};
      const mockCreatedAuth: MockIAuth = {};
      const mockAuthModel = createMockAuthModel();
      jest.mocked(mockAuthModel.create).mockResolvedValue(mockCreatedAuth as any as never);

      const repo = new AuthRepository(mockAuthModel as any);

      const result = await repo.create(mockAuth as any);

      expect(mockAuthModel.create).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockCreatedAuth as any);
    });
  });

  // Edge Case Tests
  describe('Edge cases', () => {
    it('should propagate errors thrown by the model create method', async () => {
      // This test ensures that if the underlying model throws, the error is propagated.
      const mockAuth: MockIAuth = {
        token: 'error-token',
        id: new MockObjectId(),
      };
      const mockAuthModel = createMockAuthModel();
      const error = new Error('Database error');
      jest.mocked(mockAuthModel.create).mockRejectedValue(error as never);

      const repo = new AuthRepository(mockAuthModel as any);

      await expect(repo.create(mockAuth as any)).rejects.toThrow('Database error');
      expect(mockAuthModel.create).toHaveBeenCalledWith(mockAuth as any);
    });

    it('should handle creation when token is an empty string', async () => {
      // This test ensures that a user can be created with an empty string as token.
      const mockAuth: MockIAuth = {
        token: '',
        id: new MockObjectId(),
      };
      const mockCreatedAuth: MockIAuth = {
        token: '',
        id: new MockObjectId(),
      };
      const mockAuthModel = createMockAuthModel();
      jest.mocked(mockAuthModel.create).mockResolvedValue(mockCreatedAuth as any as never);

      const repo = new AuthRepository(mockAuthModel as any);

      const result = await repo.create(mockAuth as any);

      expect(mockAuthModel.create).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockCreatedAuth as any);
    });

    it('should handle creation when id is a falsy value (simulate undefined)', async () => {
      // This test ensures that a user can be created when id is undefined.
      const mockAuth: MockIAuth = {
        token: 'token-without-id',
        id: undefined,
      };
      const mockCreatedAuth: MockIAuth = {
        token: 'token-without-id',
        id: undefined,
      };
      const mockAuthModel = createMockAuthModel();
      jest.mocked(mockAuthModel.create).mockResolvedValue(mockCreatedAuth as any as never);

      const repo = new AuthRepository(mockAuthModel as any);

      const result = await repo.create(mockAuth as any);

      expect(mockAuthModel.create).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockCreatedAuth as any);
    });

    it('should handle creation when both token and id are empty/undefined', async () => {
      // This test ensures that a user can be created when both token and id are undefined.
      const mockAuth: MockIAuth = {
        token: undefined,
        id: undefined,
      };
      const mockCreatedAuth: MockIAuth = {
        token: undefined,
        id: undefined,
      };
      const mockAuthModel = createMockAuthModel();
      jest.mocked(mockAuthModel.create).mockResolvedValue(mockCreatedAuth as any as never);

      const repo = new AuthRepository(mockAuthModel as any);

      const result = await repo.create(mockAuth as any);

      expect(mockAuthModel.create).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockCreatedAuth as any);
    });

    it('should handle creation when token is a very long string', async () => {
      // This test ensures that a user can be created with a very long token string.
      const longToken = 'a'.repeat(10000);
      const mockAuth: MockIAuth = {
        token: longToken,
        id: new MockObjectId(),
      };
      const mockCreatedAuth: MockIAuth = {
        token: longToken,
        id: new MockObjectId(),
      };
      const mockAuthModel = createMockAuthModel();
      jest.mocked(mockAuthModel.create).mockResolvedValue(mockCreatedAuth as any as never);

      const repo = new AuthRepository(mockAuthModel as any);

      const result = await repo.create(mockAuth as any);

      expect(mockAuthModel.create).toHaveBeenCalledWith(mockAuth as any);
      expect(result).toBe(mockCreatedAuth as any);
    });
  });
});
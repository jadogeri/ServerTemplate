
import { UserLogoutResponseDTO } from '../../dtos/response/UserLogoutResponseDTO';
import { ErrorResponse } from '../../entities/ErrorResponse';
import UserService from '../UserService';


// app/v2/src/services/UserService.logoutUser.spec.ts
// Manual mocks for complex dependencies

// Mock for mongoose.Types.ObjectId
class Mockmongoose {
  public static Types = {
    ObjectId: class {
      public id: string = 'mock-object-id';
      constructor(id?: string) {
        this.id = id || 'mock-object-id';
      }
      toString() {
        return this.id;
      }
    }
  };
}

// Mock for IJwtPayload
interface MockIJwtPayload {
  token?: string;
  user: {
    username: string;
    email: string;
    id: InstanceType<typeof Mockmongoose.Types.ObjectId>;
  };
}







// Mock for IUserRepository
const mockUserRepository = {
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// Mock for IAuthService
const mockAuthService = {
  findByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findByToken: jest.fn(),
  remove: jest.fn(),
  removeByUserID: jest.fn(),
};

// Mock for IBcryptService
const mockBcryptService = {
  updateUUID: jest.fn(),
  getUUID: jest.fn(),
  getHashedPassword: jest.fn(),
};

// Mock for IEmailService
const mockEmailService = {
  sendEmail: jest.fn(),
};

// Mock for ITextService
const mockTextService = {
  sendSms: jest.fn(),
};

describe('UserService.logoutUser() logoutUser method', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(
      mockUserRepository as any,
      mockAuthService as any,
      mockBcryptService as any,
      mockEmailService as any,
      mockTextService as any
    );
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should successfully logout a user when token is valid and user is authenticated', async () => {
      // This test aims to verify that a valid token and authenticated user results in a successful logout.
      const mockObjectId = new Mockmongoose.Types.ObjectId('user-id-1');
      const mockJwtPayload: MockIJwtPayload = {
        token: 'valid-token',
        user: {
          username: 'testuser',
          email: 'testuser@example.com',
          id: mockObjectId,
        },
      };

      // Simulate authenticated user found by token
      jest.mocked(mockAuthService.findByToken).mockResolvedValue({
        token: 'valid-token',
        id: mockObjectId,
      } as any);

      // Simulate successful removal of token
      jest.mocked(mockAuthService.remove).mockResolvedValue(undefined as any);

      const result = await userService.logoutUser(mockJwtPayload as any);

      expect(mockAuthService.findByToken).toHaveBeenCalledWith('valid-token');
      expect(mockAuthService.remove).toHaveBeenCalledWith('valid-token');
      expect(result).toEqual({
        message: 'Successfully logged out user testuser',
      } as UserLogoutResponseDTO);
    });

    it('should call remove on authService with the correct token', async () => {
      // This test aims to ensure that the remove method is called with the correct token.
      const mockObjectId = new Mockmongoose.Types.ObjectId('user-id-2');
      const mockJwtPayload: MockIJwtPayload = {
        token: 'another-valid-token',
        user: {
          username: 'anotheruser',
          email: 'anotheruser@example.com',
          id: mockObjectId,
        },
      };

      jest.mocked(mockAuthService.findByToken).mockResolvedValue({
        token: 'another-valid-token',
        id: mockObjectId,
      } as any);

      jest.mocked(mockAuthService.remove).mockResolvedValue(undefined as any);

      await userService.logoutUser(mockJwtPayload as any);

      expect(mockAuthService.remove).toHaveBeenCalledWith('another-valid-token');
    });

    it('should return correct message with username from payload', async () => {
      // This test aims to verify that the returned message includes the correct username.
      const mockObjectId = new Mockmongoose.Types.ObjectId('user-id-3');
      const mockJwtPayload: MockIJwtPayload = {
        token: 'token-3',
        user: {
          username: 'user3',
          email: 'user3@example.com',
          id: mockObjectId,
        },
      };

      jest.mocked(mockAuthService.findByToken).mockResolvedValue({
        token: 'token-3',
        id: mockObjectId,
      } as any);

      jest.mocked(mockAuthService.remove).mockResolvedValue(undefined as any);

      const result = await userService.logoutUser(mockJwtPayload as any);

      expect(result).toEqual({
        message: 'Successfully logged out user user3',
      } as UserLogoutResponseDTO);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return ErrorResponse if user is already logged out (no auth found)', async () => {
      // This test aims to verify that if no authenticated user is found, an ErrorResponse is returned.
      const mockObjectId = new Mockmongoose.Types.ObjectId('user-id-4');
      const mockJwtPayload: MockIJwtPayload = {
        token: 'invalid-token',
        user: {
          username: 'user4',
          email: 'user4@example.com',
          id: mockObjectId,
        },
      };

      jest.mocked(mockAuthService.findByToken).mockResolvedValue(null as any);

      const result = await userService.logoutUser(mockJwtPayload as any);

      expect(mockAuthService.findByToken).toHaveBeenCalledWith('invalid-token');
      expect(result).toBeInstanceOf(ErrorResponse);
      expect((result as ErrorResponse).statusCode).toBe(401);
      expect((result as ErrorResponse).message).toBe('Already logged out');
    });

    it('should handle missing token in jwtPayload gracefully', async () => {
      // This test aims to verify that a missing token in jwtPayload is handled and returns ErrorResponse.
      const mockObjectId = new Mockmongoose.Types.ObjectId('user-id-5');
      const mockJwtPayload: MockIJwtPayload = {
        // token is missing
        user: {
          username: 'user5',
          email: 'user5@example.com',
          id: mockObjectId,
        },
      };

      jest.mocked(mockAuthService.findByToken).mockResolvedValue(null as any);

      const result = await userService.logoutUser(mockJwtPayload as any);

      expect(mockAuthService.findByToken).toHaveBeenCalledWith(undefined);
      expect(result).toBeInstanceOf(ErrorResponse);
      expect((result as ErrorResponse).statusCode).toBe(401);
      expect((result as ErrorResponse).message).toBe('Already logged out');
    });

    it('should handle missing user in jwtPayload gracefully', async () => {
      // This test aims to verify that a missing user in jwtPayload does not throw and returns correct message.
      const mockJwtPayload: MockIJwtPayload = {
        token: 'token-without-user',
        // @ts-ignore
        user: undefined as any,
      };

      jest.mocked(mockAuthService.findByToken).mockResolvedValue({
        token: 'token-without-user',
        id: new Mockmongoose.Types.ObjectId('user-id-6'),
      } as any);

      jest.mocked(mockAuthService.remove).mockResolvedValue(undefined as any);

      const result = await userService.logoutUser(mockJwtPayload as any);

      // username will be undefined, so message will be 'Successfully logged out user undefined'
      expect(result).toEqual({
        message: 'Successfully logged out user undefined',
      } as UserLogoutResponseDTO);
    });

    it('should propagate errors thrown by authService.findByToken', async () => {
      // This test aims to verify that errors thrown by findByToken are propagated.
      const mockObjectId = new Mockmongoose.Types.ObjectId('user-id-7');
      const mockJwtPayload: MockIJwtPayload = {
        token: 'token-error',
        user: {
          username: 'user7',
          email: 'user7@example.com',
          id: mockObjectId,
        },
      };

      jest.mocked(mockAuthService.findByToken).mockRejectedValue(new Error('DB error') as never);

      await expect(userService.logoutUser(mockJwtPayload as any)).rejects.toThrow('DB error');
    });

    it('should propagate errors thrown by authService.remove', async () => {
      // This test aims to verify that errors thrown by remove are propagated.
      const mockObjectId = new Mockmongoose.Types.ObjectId('user-id-8');
      const mockJwtPayload: MockIJwtPayload = {
        token: 'token-remove-error',
        user: {
          username: 'user8',
          email: 'user8@example.com',
          id: mockObjectId,
        },
      };

      jest.mocked(mockAuthService.findByToken).mockResolvedValue({
        token: 'token-remove-error',
        id: mockObjectId,
      } as any);

      jest.mocked(mockAuthService.remove).mockRejectedValue(new Error('Remove error') as never);

      await expect(userService.logoutUser(mockJwtPayload as any)).rejects.toThrow('Remove error');
    });

    it('should work with extra properties in jwtPayload', async () => {
      // This test aims to verify that extra properties in jwtPayload do not affect logout.
      const mockObjectId = new Mockmongoose.Types.ObjectId('user-id-9');
      const mockJwtPayload: MockIJwtPayload & { extraProp: string } = {
        token: 'token-extra',
        user: {
          username: 'user9',
          email: 'user9@example.com',
          id: mockObjectId,
        },
        extraProp: 'extra',
      };

      jest.mocked(mockAuthService.findByToken).mockResolvedValue({
        token: 'token-extra',
        id: mockObjectId,
      } as any);

      jest.mocked(mockAuthService.remove).mockResolvedValue(undefined as any);

      const result = await userService.logoutUser(mockJwtPayload as any);

      expect(result).toEqual({
        message: 'Successfully logged out user user9',
      } as UserLogoutResponseDTO);
    });
  });
});

import { ErrorResponse } from '../../entities/ErrorResponse';
import UserService from '../UserService';


// app/v2/src/services/UserService.forgotUser.spec.ts
// Manual mocks for dependencies

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

// Mock for UserForgotRequestDTO
interface MockUserForgotRequestDTO {
  email: string;
}


// Mock for IUser
interface MockIUser {
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  isEnabled?: boolean;
  failedLogins?: number;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: any;
}







// Begin test suite
describe('UserService.forgotUser() forgotUser method', () => {
  let mockUserRepository: any;
  let mockAuthService: any;
  let mockBcryptService: any;
  let mockEmailService: any;
  let mockTextService: any;
  let userService: UserService;

  beforeEach(() => {
    // Reset all mocks before each test
    mockUserRepository = {
      findByEmail: jest.fn(),
      update: jest.fn(),
    };
    mockAuthService = {};
    mockBcryptService = {
      getHashedPassword: jest.fn(),
      getUUID: jest.fn(),
    };
    mockEmailService = {
      sendEmail: jest.fn(),
    };
    mockTextService = {};

    userService = new UserService(
      mockUserRepository as any,
      mockAuthService as any,
      mockBcryptService as any,
      mockEmailService as any,
      mockTextService as any
    );
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should reset password and send email for a valid user', async () => {
      // This test ensures that forgotUser works for a valid user and sends email
      const mockEmail = 'test@example.com';
      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId('user-id-1'),
        username: 'testuser',
        email: mockEmail,
        password: 'oldpassword',
        failedLogins: 2,
        isEnabled: false,
      };
      const mockHashedPassword = 'hashed-password-123';
      const mockUUID = 'uuid-456';

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser as any);
      jest.mocked(mockBcryptService.getHashedPassword).mockResolvedValue(mockHashedPassword as any);
      jest.mocked(mockBcryptService.getUUID).mockReturnValue(mockUUID as any);
      jest.mocked(mockUserRepository.update).mockResolvedValue({ ...mockUser, password: mockHashedPassword, failedLogins: 0, isEnabled: true } as any);

      // Simulate non-test environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const req: MockUserForgotRequestDTO = { email: mockEmail };
      const result = await userService.forgotUser(req as any);

      // Restore env
      process.env.NODE_ENV = originalEnv;

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcryptService.getHashedPassword).toHaveBeenCalled();
      expect(mockBcryptService.getUUID).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        mockUser._id,
        expect.objectContaining({
          password: mockHashedPassword,
          failedLogins: 0,
          isEnabled: true,
        })
      );
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'forgot-password',
        expect.objectContaining({
          username: mockUser.username,
          email: mockUser.email,
          password: mockUUID,
        })
      );
      expect(result).toEqual({ password: mockUUID });
    });

    it('should not send email if NODE_ENV is "test"', async () => {
      // This test ensures that email is not sent in test environment
      const mockEmail = 'test2@example.com';
      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId('user-id-2'),
        username: 'testuser2',
        email: mockEmail,
        password: 'oldpassword2',
        failedLogins: 1,
        isEnabled: false,
      };
      const mockHashedPassword = 'hashed-password-abc';
      const mockUUID = 'uuid-def';

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser as any);
      jest.mocked(mockBcryptService.getHashedPassword).mockResolvedValue(mockHashedPassword as any);
      jest.mocked(mockBcryptService.getUUID).mockReturnValue(mockUUID as any);
      jest.mocked(mockUserRepository.update).mockResolvedValue({ ...mockUser, password: mockHashedPassword, failedLogins: 0, isEnabled: true } as any);

      // Simulate test environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';

      const req: MockUserForgotRequestDTO = { email: mockEmail };
      const result = await userService.forgotUser(req as any);

      // Restore env
      process.env.NODE_ENV = originalEnv;

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcryptService.getHashedPassword).toHaveBeenCalled();
      expect(mockBcryptService.getUUID).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        mockUser._id,
        expect.objectContaining({
          password: mockHashedPassword,
          failedLogins: 0,
          isEnabled: true,
        })
      );
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
      expect(result).toEqual({ password: mockUUID });
    });

    it('should handle user with missing username gracefully', async () => {
      // This test ensures that forgotUser works even if username is missing
      const mockEmail = 'nousername@example.com';
      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId('user-id-3'),
        email: mockEmail,
        password: 'oldpassword3',
        failedLogins: 0,
        isEnabled: false,
      };
      const mockHashedPassword = 'hashed-password-xyz';
      const mockUUID = 'uuid-uvw';

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser as any);
      jest.mocked(mockBcryptService.getHashedPassword).mockResolvedValue(mockHashedPassword as any);
      jest.mocked(mockBcryptService.getUUID).mockReturnValue(mockUUID as any);
      jest.mocked(mockUserRepository.update).mockResolvedValue({ ...mockUser, password: mockHashedPassword, failedLogins: 0, isEnabled: true } as any);

      // Simulate non-test environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const req: MockUserForgotRequestDTO = { email: mockEmail };
      const result = await userService.forgotUser(req as any);

      // Restore env
      process.env.NODE_ENV = originalEnv;

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcryptService.getHashedPassword).toHaveBeenCalled();
      expect(mockBcryptService.getUUID).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        mockUser._id,
        expect.objectContaining({
          password: mockHashedPassword,
          failedLogins: 0,
          isEnabled: true,
        })
      );
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'forgot-password',
        expect.objectContaining({
          username: undefined,
          email: mockUser.email,
          password: mockUUID,
        })
      );
      expect(result).toEqual({ password: mockUUID });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return ErrorResponse for non-existent email', async () => {
      // This test ensures that forgotUser returns error for invalid email
      const mockEmail = 'notfound@example.com';
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(null as any);

      const req: MockUserForgotRequestDTO = { email: mockEmail };
      const result = await userService.forgotUser(req as any);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(result).toBeInstanceOf(ErrorResponse);
      expect((result as ErrorResponse).statusCode).toBe(400);
      expect((result as ErrorResponse).message).toBe(`Invalid Email: ${mockEmail}`);
      expect(mockBcryptService.getHashedPassword).not.toHaveBeenCalled();
      expect(mockBcryptService.getUUID).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should propagate error if getHashedPassword throws', async () => {
      // This test ensures that errors from bcryptService.getHashedPassword are propagated
      const mockEmail = 'errorhash@example.com';
      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId('user-id-4'),
        username: 'erroruser',
        email: mockEmail,
        password: 'oldpassword4',
        failedLogins: 0,
        isEnabled: false,
      };

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser as any);
      jest.mocked(mockBcryptService.getHashedPassword).mockRejectedValue(new Error('Hashing failed') as never);

      const req: MockUserForgotRequestDTO = { email: mockEmail };

      await expect(userService.forgotUser(req as any)).rejects.toThrow('Hashing failed');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcryptService.getHashedPassword).toHaveBeenCalled();
      expect(mockBcryptService.getUUID).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should propagate error if userRepository.update throws', async () => {
      // This test ensures that errors from userRepository.update are propagated
      const mockEmail = 'errorupdate@example.com';
      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId('user-id-5'),
        username: 'updateuser',
        email: mockEmail,
        password: 'oldpassword5',
        failedLogins: 0,
        isEnabled: false,
      };
      const mockHashedPassword = 'hashed-password-update';
      const mockUUID = 'uuid-update';

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser as any);
      jest.mocked(mockBcryptService.getHashedPassword).mockResolvedValue(mockHashedPassword as any);
      jest.mocked(mockBcryptService.getUUID).mockReturnValue(mockUUID as any);
      jest.mocked(mockUserRepository.update).mockRejectedValue(new Error('Update failed') as never);

      const req: MockUserForgotRequestDTO = { email: mockEmail };

      await expect(userService.forgotUser(req as any)).rejects.toThrow('Update failed');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcryptService.getHashedPassword).toHaveBeenCalled();
      expect(mockBcryptService.getUUID).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        mockUser._id,
        expect.objectContaining({
          password: mockHashedPassword,
          failedLogins: 0,
          isEnabled: true,
        })
      );
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should handle user with missing _id property gracefully', async () => {
      // This test ensures that forgotUser handles user objects missing _id
      const mockEmail = 'missingid@example.com';
      const mockUser: MockIUser = {
        username: 'missingiduser',
        email: mockEmail,
        password: 'oldpassword6',
        failedLogins: 0,
        isEnabled: false,
        // _id is missing
      };
      const mockHashedPassword = 'hashed-password-missingid';
      const mockUUID = 'uuid-missingid';

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser as any);
      jest.mocked(mockBcryptService.getHashedPassword).mockResolvedValue(mockHashedPassword as any);
      jest.mocked(mockBcryptService.getUUID).mockReturnValue(mockUUID as any);
      jest.mocked(mockUserRepository.update).mockResolvedValue({ ...mockUser, password: mockHashedPassword, failedLogins: 0, isEnabled: true } as any);

      // Simulate non-test environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const req: MockUserForgotRequestDTO = { email: mockEmail };
      const result = await userService.forgotUser(req as any);

      // Restore env
      process.env.NODE_ENV = originalEnv;

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcryptService.getHashedPassword).toHaveBeenCalled();
      expect(mockBcryptService.getUUID).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          password: mockHashedPassword,
          failedLogins: 0,
          isEnabled: true,
        })
      );
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'forgot-password',
        expect.objectContaining({
          username: mockUser.username,
          email: mockUser.email,
          password: mockUUID,
        })
      );
      expect(result).toEqual({ password: mockUUID });
    });

    it('should handle user with extra properties', async () => {
      // This test ensures that forgotUser ignores extra properties on user object
      const mockEmail = 'extraprops@example.com';
      const mockUser: MockIUser & { extraProp: string } = {
        _id: new Mockmongoose.Types.ObjectId('user-id-6'),
        username: 'extrapropsuser',
        email: mockEmail,
        password: 'oldpassword7',
        failedLogins: 0,
        isEnabled: false,
        extraProp: 'extraValue',
      };
      const mockHashedPassword = 'hashed-password-extraprops';
      const mockUUID = 'uuid-extraprops';

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser as any);
      jest.mocked(mockBcryptService.getHashedPassword).mockResolvedValue(mockHashedPassword as any);
      jest.mocked(mockBcryptService.getUUID).mockReturnValue(mockUUID as any);
      jest.mocked(mockUserRepository.update).mockResolvedValue({ ...mockUser, password: mockHashedPassword, failedLogins: 0, isEnabled: true } as any);

      // Simulate non-test environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const req: MockUserForgotRequestDTO = { email: mockEmail };
      const result = await userService.forgotUser(req as any);

      // Restore env
      process.env.NODE_ENV = originalEnv;

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcryptService.getHashedPassword).toHaveBeenCalled();
      expect(mockBcryptService.getUUID).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        mockUser._id,
        expect.objectContaining({
          password: mockHashedPassword,
          failedLogins: 0,
          isEnabled: true,
        })
      );
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'forgot-password',
        expect.objectContaining({
          username: mockUser.username,
          email: mockUser.email,
          password: mockUUID,
        })
      );
      expect(result).toEqual({ password: mockUUID });
    });
  });
});
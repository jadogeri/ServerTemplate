
import * as bcrypt from "bcrypt";
import { ErrorResponse } from '../../entities/ErrorResponse';
import UserService from '../UserService';


// app/v2/src/services/UserService.resetUser.spec.ts


// app/v2/src/services/UserService.resetUser.spec.ts
// Manual mocks for dependencies

interface MockUserResetRequestDTO {
  email: string;
  oldPassword: string;
  newPassword: string;
}

class Mockmongoose {
  public static Types = {
    ObjectId: class {
      public id: string = 'mock-object-id';
      toString() { return this.id; }
    }
  };
}


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





// Mocked dependencies
const mockUserRepository = {
  findByEmail: jest.fn(),
  update: jest.fn(),
};

const mockAuthService = {};

const mockBcryptService = {};

const mockEmailService = {
  sendEmail: jest.fn(),
};

const mockTextService = {};

// Mock process.env
const OLD_ENV = process.env;
beforeAll(() => {
  process.env.BCRYPT_SALT_ROUNDS = '10';
});
afterAll(() => {
  process.env = OLD_ENV;
});

// Mock bcrypt
jest.mock("bcrypt");
const mockedBcrypt = jest.mocked(bcrypt);

describe('UserService.resetUser() resetUser method', () => {
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
    it('should reset password successfully when email and old password are valid', async () => {
      // This test aims to verify that resetUser returns a success message when all inputs are valid.
      const mockReq: MockUserResetRequestDTO = {
        email: 'test@example.com',
        oldPassword: 'oldpass',
        newPassword: 'newpass',
      };

      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId(),
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedOldPassword',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as any);
      mockedBcrypt.hash.mockResolvedValue('hashedNewPassword' as any);
      mockUserRepository.update.mockResolvedValue({ ...mockUser, password: 'hashedNewPassword' } as any);

      const result = await userService.resetUser(mockReq as any);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('oldpass', 'hashedOldPassword');
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('newpass', 10);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser._id, { password: 'hashedNewPassword' });
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith('reset-password', {
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(result).toEqual({
        message: "Successfully reset password of acoount with email 'test@example.com'",
      });
    });

    it('should call emailService.sendEmail with correct recipient', async () => {
      // This test aims to verify that the emailService is called with the correct recipient details.
      const mockReq: MockUserResetRequestDTO = {
        email: 'user@domain.com',
        oldPassword: 'oldpass',
        newPassword: 'newpass',
      };

      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId(),
        username: 'user1',
        email: 'user@domain.com',
        password: 'hashedOldPassword',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as any);
      mockedBcrypt.hash.mockResolvedValue('hashedNewPassword' as any);
      mockUserRepository.update.mockResolvedValue({ ...mockUser, password: 'hashedNewPassword' } as any);

      await userService.resetUser(mockReq as any);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith('reset-password', {
        username: 'user1',
        email: 'user@domain.com',
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return ErrorResponse if email does not exist', async () => {
      // This test aims to verify that resetUser returns an error if the email is not found.
      const mockReq: MockUserResetRequestDTO = {
        email: 'notfound@domain.com',
        oldPassword: 'irrelevant',
        newPassword: 'irrelevant',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null as any);

      const result = await userService.resetUser(mockReq as any);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('notfound@domain.com');
      expect(result).toBeInstanceOf(ErrorResponse);
      expect((result as ErrorResponse).statusCode).toBe(400);
      expect((result as ErrorResponse).message).toBe('Invalid Email! notfound@domain.com');
    });

    it('should return ErrorResponse if old password does not match', async () => {
      // This test aims to verify that resetUser returns an error if the old password is incorrect.
      const mockReq: MockUserResetRequestDTO = {
        email: 'user@domain.com',
        oldPassword: 'wrongpass',
        newPassword: 'newpass',
      };

      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId(),
        username: 'user1',
        email: 'user@domain.com',
        password: 'hashedOldPassword',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(false as any);

      const result = await userService.resetUser(mockReq as any);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('user@domain.com');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('wrongpass', 'hashedOldPassword');
      expect(result).toBeInstanceOf(ErrorResponse);
      expect((result as ErrorResponse).statusCode).toBe(400);
      expect((result as ErrorResponse).message).toBe('Invalid password');
    });

    it('should handle bcrypt.hash throwing an error', async () => {
      // This test aims to verify that resetUser handles errors thrown by bcrypt.hash gracefully.
      const mockReq: MockUserResetRequestDTO = {
        email: 'user@domain.com',
        oldPassword: 'oldpass',
        newPassword: 'newpass',
      };

      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId(),
        username: 'user1',
        email: 'user@domain.com',
        password: 'hashedOldPassword',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as any);
      mockedBcrypt.hash.mockRejectedValue(new Error('Hashing failed') as never);

      // The method does not catch errors, so it should throw
      await expect(userService.resetUser(mockReq as any)).rejects.toThrow('Hashing failed');
    });

    it('should handle userRepository.update throwing an error', async () => {
      // This test aims to verify that resetUser handles errors thrown by userRepository.update gracefully.
      const mockReq: MockUserResetRequestDTO = {
        email: 'user@domain.com',
        oldPassword: 'oldpass',
        newPassword: 'newpass',
      };

      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId(),
        username: 'user1',
        email: 'user@domain.com',
        password: 'hashedOldPassword',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as any);
      mockedBcrypt.hash.mockResolvedValue('hashedNewPassword' as any);
      mockUserRepository.update.mockRejectedValue(new Error('Update failed') as never);

      await expect(userService.resetUser(mockReq as any)).rejects.toThrow('Update failed');
    });

    it('should handle emailService.sendEmail throwing an error', async () => {
      // This test aims to verify that resetUser handles errors thrown by emailService.sendEmail gracefully.
      const mockReq: MockUserResetRequestDTO = {
        email: 'user@domain.com',
        oldPassword: 'oldpass',
        newPassword: 'newpass',
      };

      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId(),
        username: 'user1',
        email: 'user@domain.com',
        password: 'hashedOldPassword',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as any);
      mockedBcrypt.hash.mockResolvedValue('hashedNewPassword' as any);
      mockUserRepository.update.mockResolvedValue({ ...mockUser, password: 'hashedNewPassword' } as any);
      mockEmailService.sendEmail.mockImplementation(() => {
        throw new Error('Email failed');
      });

      // The method does not catch errors, so it should throw
      await expect(userService.resetUser(mockReq as any)).rejects.toThrow('Email failed');
    });

    it('should handle missing username in user object', async () => {
      // This test aims to verify that resetUser works even if the user object has no username.
      const mockReq: MockUserResetRequestDTO = {
        email: 'user@domain.com',
        oldPassword: 'oldpass',
        newPassword: 'newpass',
      };

      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId(),
        email: 'user@domain.com',
        password: 'hashedOldPassword',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as any);
      mockedBcrypt.hash.mockResolvedValue('hashedNewPassword' as any);
      mockUserRepository.update.mockResolvedValue({ ...mockUser, password: 'hashedNewPassword' } as any);

      const result = await userService.resetUser(mockReq as any);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith('reset-password', {
        username: undefined,
        email: 'user@domain.com',
      });
      expect(result).toEqual({
        message: "Successfully reset password of acoount with email 'user@domain.com'",
      });
    });

    it('should handle empty newPassword string', async () => {
      // This test aims to verify that resetUser can handle an empty newPassword string.
      const mockReq: MockUserResetRequestDTO = {
        email: 'user@domain.com',
        oldPassword: 'oldpass',
        newPassword: '',
      };

      const mockUser: MockIUser = {
        _id: new Mockmongoose.Types.ObjectId(),
        username: 'user1',
        email: 'user@domain.com',
        password: 'hashedOldPassword',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as any);
      mockedBcrypt.hash.mockResolvedValue('hashedEmptyPassword' as any);
      mockUserRepository.update.mockResolvedValue({ ...mockUser, password: 'hashedEmptyPassword' } as any);

      const result = await userService.resetUser(mockReq as any);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(result).toEqual({
        message: "Successfully reset password of acoount with email 'user@domain.com'",
      });
    });
  });
});

import { UserRegisterRequestDTO } from '../../dtos/request/UserRegisterRequestDTO';
import { ErrorResponse } from '../../entities/ErrorResponse';
import { IAuthService } from '../../interfaces/IAuthService';
import { IBcryptService } from '../../interfaces/IBcryptService';
import { IEmailService } from '../../interfaces/IEmailService';
import { ITextService } from '../../interfaces/ITextService';
import { IUserRepository } from '../../interfaces/IUserRepository';
import UserService from '../UserService';


// app/v2/src/services/UserService.registerUser.spec.ts


// app/v2/src/services/UserService.registerUser.spec.ts
// Manual mocks for complex dependencies

class Mockmongoose {
  public Types = {
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






// Begin test suite for registerUser
describe('UserService.registerUser() registerUser method', () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let mockBcryptService: jest.Mocked<IBcryptService>;
  let mockEmailService: jest.Mocked<IEmailService>;
  let mockTextService: jest.Mocked<ITextService>;
  let userService: UserService;
  let mockMongoose: Mockmongoose;

  // Set up environment variables
  const OLD_ENV = process.env;

  beforeEach(() => {
    // Reset environment
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.BCRYPT_SALT_ROUNDS = '10';
    process.env.NODE_ENV = 'test';

    mockUserRepository = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    mockAuthService = {
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findByToken: jest.fn(),
      remove: jest.fn(),
      removeByUserID: jest.fn(),
    } as any;

    mockBcryptService = {
      updateUUID: jest.fn(),
      getUUID: jest.fn(),
      getHashedPassword: jest.fn(),
    } as any;

    mockEmailService = {
      sendEmail: jest.fn(),
    } as any;

    mockTextService = {
      sendSms: jest.fn(),
    } as any;

    mockMongoose = new Mockmongoose();

    userService = new UserService(
      mockUserRepository as any,
      mockAuthService as any,
      mockBcryptService as any,
      mockEmailService as any,
      mockTextService as any
    );
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should register a user successfully when email and username are available', async () => {
      // This test aims to verify that a user is registered successfully when both email and username are not taken.

      const reqUser: UserRegisterRequestDTO = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      // Email and username are not taken
      mockUserRepository.findByEmail.mockResolvedValue(null as any);
      mockUserRepository.findByUsername.mockResolvedValue(null as any);

      // Mock hash
      const hashedPassword = 'hashedPassword123';
      jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue(hashedPassword as any);

      // Mock created user
      const now = new Date();
      const createdUser: MockIUser = {
        username: reqUser.username,
        email: reqUser.email,
        password: hashedPassword,
        phone: reqUser.phone,
        isEnabled: true,
        failedLogins: 0,
        createdAt: now,
        updatedAt: now,
        _id: new mockMongoose.Types.ObjectId('mock-object-id'),
      };
      mockUserRepository.create.mockResolvedValue(createdUser as any);

      // Call registerUser
      const result = await userService.registerUser(reqUser);

      // Assert result
      expect(result).toEqual({
        username: reqUser.username,
        email: reqUser.email,
        phone: reqUser.phone,
        failedLogins: 0,
        isEnabled: true,
        _id: createdUser._id,
        createdAt: now,
        updatedAt: now,
      });

      // Should hash password
      expect(require("bcrypt").hash).toHaveBeenCalledWith(
        reqUser.password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS as string)
      );

      // Should call create with hashed password
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...reqUser,
        password: hashedPassword,
      });

      // Should NOT send email in test env
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should send email if not in test environment', async () => {
      // This test aims to verify that an email is sent when NODE_ENV is not 'test'.

      process.env.NODE_ENV = 'production';

      const reqUser: UserRegisterRequestDTO = {
        username: 'produser',
        email: 'produser@example.com',
        password: 'password456',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null as any);
      mockUserRepository.findByUsername.mockResolvedValue(null as any);

      const hashedPassword = 'hashedPassword456';
      jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue(hashedPassword as any);

      const now = new Date();
      const createdUser: MockIUser = {
        username: reqUser.username,
        email: reqUser.email,
        password: hashedPassword,
        isEnabled: true,
        failedLogins: 0,
        createdAt: now,
        updatedAt: now,
        _id: new mockMongoose.Types.ObjectId('mock-object-id'),
      };
      mockUserRepository.create.mockResolvedValue(createdUser as any);

      await userService.registerUser(reqUser);

      // Should send email
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'register-account',
        {
          username: reqUser.username,
          email: reqUser.email,
        }
      );
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return error if email is already taken', async () => {
      // This test aims to verify that an error is returned when the email is already taken.

      const reqUser: UserRegisterRequestDTO = {
        username: 'user1',
        email: 'taken@example.com',
        password: 'password',
      };

      mockUserRepository.findByEmail.mockResolvedValue({ email: reqUser.email } as any);

      const result = await userService.registerUser(reqUser);

      expect(result).toBeInstanceOf(ErrorResponse);
      expect((result as ErrorResponse).statusCode).toBe(409);
      expect((result as ErrorResponse).message).toBe('Email already taken!');

      // Should not check username or create user
      expect(mockUserRepository.findByUsername).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should return error if username is already taken', async () => {
      // This test aims to verify that an error is returned when the username is already taken.

      const reqUser: UserRegisterRequestDTO = {
        username: 'takenuser',
        email: 'user2@example.com',
        password: 'password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null as any);
      mockUserRepository.findByUsername.mockResolvedValue({ username: reqUser.username } as any);

      const result = await userService.registerUser(reqUser);

      expect(result).toBeInstanceOf(ErrorResponse);
      expect((result as ErrorResponse).statusCode).toBe(409);
      expect((result as ErrorResponse).message).toBe('Username already taken!');

      // Should not create user
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should handle error thrown during hashing', async () => {
      // This test aims to verify that an error is returned if hashing throws.

      const reqUser: UserRegisterRequestDTO = {
        username: 'user3',
        email: 'user3@example.com',
        password: 'password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null as any);
      mockUserRepository.findByUsername.mockResolvedValue(null as any);

      jest.spyOn(require('bcrypt'), 'hash').mockRejectedValue(new Error('Hash error') as never);

      const result = await userService.registerUser(reqUser);

      expect(result).toBeInstanceOf(ErrorResponse);
      expect((result as ErrorResponse).statusCode).toBe(500);
      expect((result as ErrorResponse).message).toBe('mongo error!');
    });

    it('should handle error thrown during user creation', async () => {
      // This test aims to verify that an error is returned if userRepository.create throws.

      const reqUser: UserRegisterRequestDTO = {
        username: 'user4',
        email: 'user4@example.com',
        password: 'password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null as any);
      mockUserRepository.findByUsername.mockResolvedValue(null as any);

      const hashedPassword = 'hashedPassword789';
      jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue(hashedPassword as any);

      mockUserRepository.create.mockRejectedValue(new Error('Create error') as never);

      const result = await userService.registerUser(reqUser);

      expect(result).toBeInstanceOf(ErrorResponse);
      expect((result as ErrorResponse).statusCode).toBe(500);
      expect((result as ErrorResponse).message).toBe('mongo error!');
    });

    it('should handle missing optional phone field', async () => {
      // This test aims to verify that registration works when the phone field is missing.

      const reqUser: UserRegisterRequestDTO = {
        username: 'user5',
        email: 'user5@example.com',
        password: 'password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null as any);
      mockUserRepository.findByUsername.mockResolvedValue(null as any);

      const hashedPassword = 'hashedPassword999';
      jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue(hashedPassword as any);

      const now = new Date();
      const createdUser: MockIUser = {
        username: reqUser.username,
        email: reqUser.email,
        password: hashedPassword,
        isEnabled: true,
        failedLogins: 0,
        createdAt: now,
        updatedAt: now,
        _id: new mockMongoose.Types.ObjectId('mock-object-id'),
      };
      mockUserRepository.create.mockResolvedValue(createdUser as any);

      const result = await userService.registerUser(reqUser);

      expect(result).toEqual({
        username: reqUser.username,
        email: reqUser.email,
        phone: undefined,
        failedLogins: 0,
        isEnabled: true,
        _id: createdUser._id,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should handle empty password string', async () => {
      // This test aims to verify that registration works with an empty password string.

      const reqUser: UserRegisterRequestDTO = {
        username: 'user6',
        email: 'user6@example.com',
        password: '',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null as any);
      mockUserRepository.findByUsername.mockResolvedValue(null as any);

      const hashedPassword = 'hashedEmptyPassword';
      jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue(hashedPassword as any);

      const now = new Date();
      const createdUser: MockIUser = {
        username: reqUser.username,
        email: reqUser.email,
        password: hashedPassword,
        isEnabled: true,
        failedLogins: 0,
        createdAt: now,
        updatedAt: now,
        _id: new mockMongoose.Types.ObjectId('mock-object-id'),
      };
      mockUserRepository.create.mockResolvedValue(createdUser as any);

      const result = await userService.registerUser(reqUser);

      expect(result).toEqual({
        username: reqUser.username,
        email: reqUser.email,
        phone: undefined,
        failedLogins: 0,
        isEnabled: true,
        _id: createdUser._id,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should handle very long username and email', async () => {
      // This test aims to verify that registration works with very long username and email.

      const longUsername = 'u'.repeat(256);
      const longEmail = 'e'.repeat(256) + '@example.com';

      const reqUser: UserRegisterRequestDTO = {
        username: longUsername,
        email: longEmail,
        password: 'password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null as any);
      mockUserRepository.findByUsername.mockResolvedValue(null as any);

      const hashedPassword = 'hashedLongPassword';
      jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue(hashedPassword as any);

      const now = new Date();
      const createdUser: MockIUser = {
        username: longUsername,
        email: longEmail,
        password: hashedPassword,
        isEnabled: true,
        failedLogins: 0,
        createdAt: now,
        updatedAt: now,
        _id: new mockMongoose.Types.ObjectId('mock-object-id'),
      };
      mockUserRepository.create.mockResolvedValue(createdUser as any);

      const result = await userService.registerUser(reqUser);

      expect(result).toEqual({
        username: longUsername,
        email: longEmail,
        phone: undefined,
        failedLogins: 0,
        isEnabled: true,
        _id: createdUser._id,
        createdAt: now,
        updatedAt: now,
      });
    });
  });
});
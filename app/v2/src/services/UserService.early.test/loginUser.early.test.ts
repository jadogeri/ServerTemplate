
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UserLoginRequestDTO } from '../../dtos/request/UserLoginRequestDTO';
import { ErrorResponse } from '../../entities/ErrorResponse';
import UserService from '../UserService';
import { ObjectId } from "mongodb";



// app/v2/src/services/UserService.loginUser.spec.ts
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






// Mocks for injected dependencies

const mockUserRepository = {
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockAuthService = {
  findByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findByToken: jest.fn(),
  remove: jest.fn(),
  removeByUserID: jest.fn(),
};

const mockBcryptService = {
  updateUUID: jest.fn(),
  getUUID: jest.fn(),
  getHashedPassword: jest.fn(),
};

const mockEmailService = {
  sendEmail: jest.fn(),
};

const mockTextService = {
  sendSms: jest.fn(),
};

// Mock for bcrypt.compare
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

// Mock for jwt.sign
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
describe('UserService.loginUser() loginUser method', () => {
  let userService: UserService;
  let mockObjectId: any;

  beforeEach(() => {
    userService = new UserService(
      mockUserRepository as any,
      mockAuthService as any,
      mockBcryptService as any,
      mockEmailService as any,
      mockTextService as any
    );
    mockObjectId = new ObjectId('user-id-123') as any;

    // Reset all mocks before each test
    jest.clearAllMocks();
    process.env.JSON_WEB_TOKEN_SECRET = 'test-secret';
    process.env.NODE_ENV = 'test';
  });

  // --- Happy Path Tests ---

  it('should successfully login a user with correct credentials and enabled account', async () => {
    // This test aims to verify successful login with correct credentials and enabled account.
    const reqUser: UserLoginRequestDTO = {
      email: 'test@example.com',
      password: 'correct-password',
    };

    const mockUser: MockIUser = {
      _id: mockObjectId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashed-password',
      isEnabled: true,
      failedLogins: 0,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
    (bcrypt.compare as any).mockResolvedValue(true);
    (jwt.sign as any).mockReturnValue('mock-access-token');
    mockAuthService.findByUserId.mockResolvedValue(null as any);
    mockAuthService.create.mockResolvedValue({} as any);
    mockUserRepository.update.mockResolvedValue({} as any);

    const result = await userService.loginUser(reqUser);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('correct-password', 'hashed-password');
    expect(jwt.sign).toHaveBeenCalled();
    expect(mockAuthService.create).toHaveBeenCalledWith(mockObjectId, 'mock-access-token');
    expect(mockTextService.sendSms).toHaveBeenCalledWith(
      '+18777804236',
      { username: 'testuser', email: 'test@example.com' }
    );
    expect(result).toEqual({ accessToken: 'mock-access-token' });
  });

  it('should update auth if authenticatedUser exists', async () => {
    // This test aims to verify that update is called on authService if authenticatedUser exists.
    const reqUser: UserLoginRequestDTO = {
      email: 'test@example.com',
      password: 'correct-password',
    };

    const mockUser: MockIUser = {
      _id: mockObjectId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashed-password',
      isEnabled: true,
      failedLogins: 0,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
    (bcrypt.compare as any).mockResolvedValue(true);
    (jwt.sign as any).mockReturnValue('mock-access-token');
    mockAuthService.findByUserId.mockResolvedValue({ token: 'old-token' } as any);
    mockAuthService.update.mockResolvedValue({} as any);
    mockUserRepository.update.mockResolvedValue({} as any);

    const result = await userService.loginUser(reqUser);

    expect(mockAuthService.update).toHaveBeenCalledWith(mockObjectId, 'mock-access-token');
    expect(result).toEqual({ accessToken: 'mock-access-token' });
  });

  it('should reset failedLogins to zero if user had failedLogins > 0', async () => {
    // This test aims to verify that failedLogins is reset to zero on successful login.
    const reqUser: UserLoginRequestDTO = {
      email: 'test@example.com',
      password: 'correct-password',
    };

    const mockUser: MockIUser = {
      _id: mockObjectId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashed-password',
      isEnabled: true,
      failedLogins: 2,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
    (bcrypt.compare as any).mockResolvedValue(true);
    (jwt.sign as any).mockReturnValue('mock-access-token');
    mockAuthService.findByUserId.mockResolvedValue(null as any);
    mockAuthService.create.mockResolvedValue({} as any);
    mockUserRepository.update.mockResolvedValue({} as any);

    const result = await userService.loginUser(reqUser);

    expect(mockUserRepository.update).toHaveBeenCalledWith(mockObjectId, { failedLogins: 0 });
    expect(result).toEqual({ accessToken: 'mock-access-token' });
  });

  // --- Edge Case Tests ---

  it('should return error if email does not exist', async () => {
    // This test aims to verify error response when email is not found.
    const reqUser: UserLoginRequestDTO = {
      email: 'notfound@example.com',
      password: 'any-password',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null as any);

    const result = await userService.loginUser(reqUser);

    expect(result).toBeInstanceOf(ErrorResponse);
    expect((result as ErrorResponse).message).toBe('email does not exist');
    expect((result as ErrorResponse).statusCode).toBe(400);
  });

  it('should return error if account is locked (isEnabled is false)', async () => {
    // This test aims to verify error response when account is locked.
    const reqUser: UserLoginRequestDTO = {
      email: 'locked@example.com',
      password: 'any-password',
    };

    const mockUser: MockIUser = {
      _id: mockObjectId,
      email: 'locked@example.com',
      username: 'lockeduser',
      password: 'hashed-password',
      isEnabled: false,
      failedLogins: 0,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);

    const result = await userService.loginUser(reqUser);

    expect(result).toBeInstanceOf(ErrorResponse);
    expect((result as ErrorResponse).message).toBe('Account is locked, use forget account to access acount');
    expect((result as ErrorResponse).statusCode).toBe(423);
    expect((result as ErrorResponse).email).toBe('locked@example.com');
    expect((result as ErrorResponse).username).toBe('lockeduser');
  });

  it('should increment failedLogins and return error for incorrect password', async () => {
    // This test aims to verify failedLogins increment and error response for incorrect password.
    const reqUser: UserLoginRequestDTO = {
      email: 'test@example.com',
      password: 'wrong-password',
    };

    const mockUser: MockIUser = {
      _id: mockObjectId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashed-password',
      isEnabled: true,
      failedLogins: 1,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
    (bcrypt.compare as any).mockResolvedValue(false);
    mockUserRepository.update.mockResolvedValue({} as any);

    const result = await userService.loginUser(reqUser);

    expect(mockUserRepository.update).toHaveBeenCalledWith(mockObjectId, {
      ...mockUser,
      failedLogins: 2,
    });
    expect(result).toBeInstanceOf(ErrorResponse);
    expect((result as ErrorResponse).message).toBe('email or password is incorrect');
    expect((result as ErrorResponse).statusCode).toBe(400);
  });

  it('should lock account and send email if failedLogins exceeds 3', async () => {
    // This test aims to verify account locking and email sending after too many failed logins.
    const reqUser: UserLoginRequestDTO = {
      email: 'test@example.com',
      password: 'wrong-password',
    };

    const mockUser: MockIUser = {
      _id: mockObjectId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashed-password',
      isEnabled: true,
      failedLogins: 3,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
    (bcrypt.compare as any).mockResolvedValue(false);
    mockUserRepository.update.mockResolvedValue({} as any);

    // NODE_ENV is 'test', so emailService.sendEmail should NOT be called
    const result = await userService.loginUser(reqUser);

    expect(mockUserRepository.update).toHaveBeenCalledWith(mockObjectId, {
      ...mockUser,
      failedLogins: 4,
      isEnabled: false,
    });
    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(ErrorResponse);
    expect((result as ErrorResponse).message).toBe(
      'Account is locked because of too many failed login attempts. Use /forgt route to access acount'
    );
    expect((result as ErrorResponse).statusCode).toBe(400);
    expect((result as ErrorResponse).email).toBe('test@example.com');
    expect((result as ErrorResponse).username).toBe('testuser');
  });

  it('should send email when account is locked and NODE_ENV is not test', async () => {
    // This test aims to verify that email is sent when account is locked and NODE_ENV is not 'test'.
    process.env.NODE_ENV = 'production';

    const reqUser: UserLoginRequestDTO = {
      email: 'test@example.com',
      password: 'wrong-password',
    };

    const mockUser: MockIUser = {
      _id: mockObjectId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashed-password',
      isEnabled: true,
      failedLogins: 3,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
    (bcrypt.compare as any).mockResolvedValue(false);
    mockUserRepository.update.mockResolvedValue({} as any);

    const result = await userService.loginUser(reqUser);

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      'locked-account',
      { username: 'testuser', email: 'test@example.com' }
    );
    expect(result).toBeInstanceOf(ErrorResponse);
    expect((result as ErrorResponse).message).toBe(
      'Account is locked because of too many failed login attempts. Use /forgt route to access acount'
    );
  });

  it('should handle missing username and email in user object gracefully', async () => {
    // This test aims to verify that missing username/email does not break the method.
    const reqUser: UserLoginRequestDTO = {
      email: 'test@example.com',
      password: 'correct-password',
    };

    const mockUser: MockIUser = {
      _id: mockObjectId,
      password: 'hashed-password',
      isEnabled: true,
      failedLogins: 0,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
    (bcrypt.compare as any).mockResolvedValue(true);
    (jwt.sign as any).mockReturnValue('mock-access-token');
    mockAuthService.findByUserId.mockResolvedValue(null as any);
    mockAuthService.create.mockResolvedValue({} as any);
    mockUserRepository.update.mockResolvedValue({} as any);

    const result = await userService.loginUser(reqUser);

    expect(result).toEqual({ accessToken: 'mock-access-token' });
    expect(mockTextService.sendSms).toHaveBeenCalledWith(
      '+18777804236',
      { username: undefined, email: undefined }
    );
  });

  it('should throw if process.env.JSON_WEB_TOKEN_SECRET is missing', async () => {
    // This test aims to verify that missing JWT secret throws an error.
    process.env.JSON_WEB_TOKEN_SECRET = undefined;

    const reqUser: UserLoginRequestDTO = {
      email: 'test@example.com',
      password: 'correct-password',
    };

    const mockUser: MockIUser = {
      _id: mockObjectId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashed-password',
      isEnabled: true,
      failedLogins: 0,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
    (bcrypt.compare as any).mockResolvedValue(true);

    await expect(userService.loginUser(reqUser)).rejects.toThrow();
  });
});

import * as bcrypt from "bcrypt";
import { ErrorResponse } from '../../entities/ErrorResponse';
import UserService from '../UserService';


// UserService.deactivateUser.spec.ts


// UserService.deactivateUser.spec.ts
// Manual mocks for dependencies

// Mock for mongoose.Types.ObjectId
class MockObjectId {
  public _id: string = '507f1f77bcf86cd799439011';
  toString() {
    return this._id;
  }
}

// Mock for UserDeactivateRequestDTO
interface MockUserDeactivateRequestDTO {
  email: string;
  password: string;
  confirm: string;
}

// Mock for IUser
interface MockIUser {
  _id: MockObjectId;
  username: string;
  email: string;
  password: string;
}

// Mock for IAuthService
class MockAuthService {
  public removeByUserID = jest.fn();
}

// Mock for IUserRepository
class MockUserRepository {
  public findByEmail = jest.fn();
  public remove = jest.fn();
}

// Mock for IBcryptService
class MockBcryptService {
  public updateUUID = jest.fn();
  public getUUID = jest.fn();
  public getHashedPassword = jest.fn();
}

// Mock for IEmailService
class MockEmailService {
  public sendEmail = jest.fn();
}

// Mock for ITextService
class MockTextService {
  public sendSms = jest.fn();
}


// Mock for process.env
const originalEnv = process.env;

// Begin tests
describe('UserService.deactivateUser() deactivateUser method', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepository;
  let mockAuthService: MockAuthService;
  let mockBcryptService: MockBcryptService;
  let mockEmailService: MockEmailService;
  let mockTextService: MockTextService;

  // Common mock user
  const mockUser: MockIUser = {
    _id: new MockObjectId(),
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockAuthService = new MockAuthService();
    mockBcryptService = new MockBcryptService();
    mockEmailService = new MockEmailService();
    mockTextService = new MockTextService();

    userService = new UserService(
      mockUserRepository as any,
      mockAuthService as any,
      mockBcryptService as any,
      mockEmailService as any,
      mockTextService as any
    );
    jest.clearAllMocks();
    process.env = { ...originalEnv }; // Reset env
  });

  // --- Happy Path Tests ---

  it('should deactivate user successfully and send email when NODE_ENV is not "test"', async () => {
    // This test ensures that a valid user is deactivated, auth removed, user removed, and email sent.
    process.env.NODE_ENV = 'production';

    const mockRequest: MockUserDeactivateRequestDTO = {
      email: mockUser.email,
      password: 'plaintextpassword',
      confirm: 'plaintextpassword',
    };

    jest
      .mocked(mockUserRepository.findByEmail)
      .mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(true as any);
    jest
      .mocked(mockAuthService.removeByUserID)
      .mockResolvedValue({} as any);
    jest
      .mocked(mockUserRepository.remove)
      .mockResolvedValue({} as any);

    const result = await userService.deactivateUser(
      mockRequest as any
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      mockUser.email
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockRequest.password,
      mockUser.password
    );
    expect(mockAuthService.removeByUserID).toHaveBeenCalledWith(
      mockUser._id
    );
    expect(mockUserRepository.remove).toHaveBeenCalledWith(
      mockUser._id
    );
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      'forgot-password',
      {
        username: mockUser.username,
        email: mockUser.email,
      }
    );
    expect(result).toEqual({
      message: `deactivated acoount with email ${mockUser.email}`,
    });
  });

  it('should deactivate user successfully and NOT send email when NODE_ENV is "test"', async () => {
    // This test ensures that email is not sent in test environment.
    process.env.NODE_ENV = 'test';

    const mockRequest: MockUserDeactivateRequestDTO = {
      email: mockUser.email,
      password: 'plaintextpassword',
      confirm: 'plaintextpassword',
    };

    jest
      .mocked(mockUserRepository.findByEmail)
      .mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(true as any);
    jest
      .mocked(mockAuthService.removeByUserID)
      .mockResolvedValue({} as any);
    jest
      .mocked(mockUserRepository.remove)
      .mockResolvedValue({} as any);

    const result = await userService.deactivateUser(
      mockRequest as any
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      mockUser.email
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockRequest.password,
      mockUser.password
    );
    expect(mockAuthService.removeByUserID).toHaveBeenCalledWith(
      mockUser._id
    );
    expect(mockUserRepository.remove).toHaveBeenCalledWith(
      mockUser._id
    );
    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    expect(result).toEqual({
      message: `deactivated acoount with email ${mockUser.email}`,
    });
  });

  // --- Edge Case Tests ---

  it('should return ErrorResponse if user email does not exist', async () => {
    // This test ensures that if the user is not found, an error is returned.
    const mockRequest: MockUserDeactivateRequestDTO = {
      email: 'notfound@example.com',
      password: 'irrelevant',
      confirm: 'irrelevant',
    };

    jest
      .mocked(mockUserRepository.findByEmail)
      .mockResolvedValue(null as any);

    const result = await userService.deactivateUser(
      mockRequest as any
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      mockRequest.email
    );
    expect(result).toBeInstanceOf(ErrorResponse);
    expect((result as ErrorResponse).statusCode).toBe(400);
    expect((result as ErrorResponse).message).toBe(
      'Email does not exist'
    );
    expect(mockAuthService.removeByUserID).not.toHaveBeenCalled();
    expect(mockUserRepository.remove).not.toHaveBeenCalled();
    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
  });

  it('should return ErrorResponse if password is invalid', async () => {
    // This test ensures that if the password is incorrect, an error is returned.
    const mockRequest: MockUserDeactivateRequestDTO = {
      email: mockUser.email,
      password: 'wrongpassword',
      confirm: 'wrongpassword',
    };

    jest
      .mocked(mockUserRepository.findByEmail)
      .mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(false as any);

    const result = await userService.deactivateUser(
      mockRequest as any
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      mockUser.email
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockRequest.password,
      mockUser.password
    );
    expect(result).toBeInstanceOf(ErrorResponse);
    expect((result as ErrorResponse).statusCode).toBe(400);
    expect((result as ErrorResponse).message).toBe(
      'Invalid password or email'
    );
    expect(mockAuthService.removeByUserID).not.toHaveBeenCalled();
    expect(mockUserRepository.remove).not.toHaveBeenCalled();
    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
  });

  it('should propagate error if userRepository.findByEmail throws', async () => {
    // This test ensures that if findByEmail throws, the error is propagated.
    const mockRequest: MockUserDeactivateRequestDTO = {
      email: mockUser.email,
      password: 'irrelevant',
      confirm: 'irrelevant',
    };

    jest
      .mocked(mockUserRepository.findByEmail)
      .mockRejectedValue(new Error('DB error') as never);

    await expect(
      userService.deactivateUser(mockRequest as any)
    ).rejects.toThrow('DB error');
  });

  it('should propagate error if bcrypt.compare throws', async () => {
    // This test ensures that if bcrypt.compare throws, the error is propagated.
    const mockRequest: MockUserDeactivateRequestDTO = {
      email: mockUser.email,
      password: 'irrelevant',
      confirm: 'irrelevant',
    };

    jest
      .mocked(mockUserRepository.findByEmail)
      .mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, 'compare')
      .mockRejectedValue(new Error('bcrypt error') as never);

    await expect(
      userService.deactivateUser(mockRequest as any)
    ).rejects.toThrow('bcrypt error');
  });

  it('should propagate error if authService.removeByUserID throws', async () => {
    // This test ensures that if removeByUserID throws, the error is propagated.
    const mockRequest: MockUserDeactivateRequestDTO = {
      email: mockUser.email,
      password: 'plaintextpassword',
      confirm: 'plaintextpassword',
    };

    jest
      .mocked(mockUserRepository.findByEmail)
      .mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(true as any);
    jest
      .mocked(mockAuthService.removeByUserID)
      .mockRejectedValue(new Error('auth error') as never);

    await expect(
      userService.deactivateUser(mockRequest as any)
    ).rejects.toThrow('auth error');
  });

  it('should propagate error if userRepository.remove throws', async () => {
    // This test ensures that if userRepository.remove throws, the error is propagated.
    const mockRequest: MockUserDeactivateRequestDTO = {
      email: mockUser.email,
      password: 'plaintextpassword',
      confirm: 'plaintextpassword',
    };

    jest
      .mocked(mockUserRepository.findByEmail)
      .mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(true as any);
    jest
      .mocked(mockAuthService.removeByUserID)
      .mockResolvedValue({} as any);
    jest
      .mocked(mockUserRepository.remove)
      .mockRejectedValue(new Error('remove error') as never);

    await expect(
      userService.deactivateUser(mockRequest as any)
    ).rejects.toThrow('remove error');
  });

  it('should not include company, password, year, or logoUrl in recipient if not present', async () => {
    // This test ensures that only username and email are sent in recipient.
    process.env.NODE_ENV = 'production';

    const mockRequest: MockUserDeactivateRequestDTO = {
      email: mockUser.email,
      password: 'plaintextpassword',
      confirm: 'plaintextpassword',
    };

    jest
      .mocked(mockUserRepository.findByEmail)
      .mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(true as any);
    jest
      .mocked(mockAuthService.removeByUserID)
      .mockResolvedValue({} as any);
    jest
      .mocked(mockUserRepository.remove)
      .mockResolvedValue({} as any);

    await userService.deactivateUser(mockRequest as any);

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      'forgot-password',
      {
        username: mockUser.username,
        email: mockUser.email,
      }
    );
  });

  afterAll(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });
});
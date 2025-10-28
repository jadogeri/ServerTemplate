
import { IUser } from "../../../../src/interfaces/IUser";
import { mockUserRepository } from "../../../__mocks__/repositories/UserRepository.repositories";
import { mockEmailService } from "../../../__mocks__/services/EmailService.services";
import { mockTextService } from "../../../__mocks__/services/TextService.services";
import UserService from "../../../../src/services/UserService";
import { mockBcryptService } from "../../../__mocks__/services/BcryptService.services";
import { mockAuthService } from "../../../__mocks__/services/AuthService.services";
import { IUserService } from "../../../../src/interfaces/IUserService";
import { ObjectId } from "mongodb";

describe('UserService.registerUser() register user method', () => {

  let mockUserService: IUserService;

    beforeEach(() => {
      // Re-initialize the mock before each test
      jest.clearAllMocks();

      mockUserService = new UserService(mockUserRepository, mockAuthService, mockBcryptService, mockEmailService, mockTextService);
      
  });

  afterAll(() => {
    // Restore the original userRepository after all tests
  });

  // Happy Path Tests
  describe('Happy Paths', () => {

    
    test('should create a user with all fields provided', async () => {
      // This test ensures that a user with all fields is created successfully.
      const inputUser: IUser = {
        _id: new ObjectId(),
        email: 'test@example.com',
        password: 'securepassword',
        username: 'testuser',
        phone: '1234567890',
        isEnabled: true,
        failedLogins: 0,
      };

      const createdUser = {
        ...inputUser,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      delete createdUser.password

      jest.mocked(mockUserRepository.create).mockResolvedValue(createdUser as any);

      const result = await mockUserService.registerUser(inputUser as any);

      
      expect(mockUserRepository.create).toHaveBeenCalledWith(inputUser as any);
      expect(result).toEqual(createdUser);
    });


    test('should create a user with only required fields', async () => {
      // This test ensures that a user with only required fields is created successfully.
      const inputUser: IUser = {
        email: 'test@example.com',
        password: 'securepassword',
        username: 'testuser',

      };

      const createdUser = {
        ...inputUser,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      delete createdUser.password

      jest.mocked(mockUserRepository.create).mockResolvedValue(createdUser as any);

      const result = await mockUserService.registerUser(inputUser as any);

      expect(mockUserRepository.create).toHaveBeenCalledWith(inputUser as any);
      expect(result).toEqual(createdUser);
    });


    test('should create a user with optional fields omitted', async () => {
      // This test ensures that a user is created even if optional fields are omitted.
      const inputUser: IUser = {
        email: 'optional@example.com',
        password: 'optionalpass',
        username: 'optionaluser',
      };

      const createdUser = {
        ...inputUser,
        _id:undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        failedLogins : undefined,
        isEnabled: undefined,
        phone: undefined,
      };

      delete createdUser.password

      jest.mocked(mockUserRepository.create).mockResolvedValue(createdUser as any);

      const result = await mockUserService.registerUser(inputUser as any);

      expect(mockUserRepository.create).toHaveBeenCalledWith(inputUser as any);
      expect(result).toEqual(createdUser);
    });
  });

  
  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle user creation when failedLogins is a large number', async () => {
      // This test ensures that a user with a large failedLogins value is handled correctly.
      const inputUser: IUser = {
        email: 'edge@example.com',
        password: 'edgepass',
        failedLogins: Number.MAX_SAFE_INTEGER,
      };

      const createdUser = {
        ...inputUser,
        createdAt: new Date(),
        failedLogins: 0,

      };

      delete createdUser.password
      jest.mocked(mockUserRepository.create).mockResolvedValue(createdUser as any);

      const result = await mockUserService.registerUser(inputUser as any);

      expect(mockUserRepository.create).toHaveBeenCalledWith(inputUser as any);
      expect(result).toEqual(createdUser);
    });

    test('should handle user creation when isEnabled is false', async () => {
      // This test ensures that a user with isEnabled set to false is handled correctly.
      const inputUser: IUser = {
        _id: new ObjectId(),
        email: 'disabled@example.com',
        password: 'disabledpass',
        isEnabled: false,
      };

      const createdUser = {
        ...inputUser,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      delete createdUser.password

      jest.mocked(mockUserRepository.create).mockResolvedValue(createdUser as any);

      const result = await mockUserService.registerUser(inputUser as any);

      expect(mockUserRepository.create).toHaveBeenCalledWith(inputUser as any);
      expect(result).toEqual(createdUser);
    });

    /*
    test('should throw an error if userRepository.save rejects', async () => {
      // This test ensures that an error is thrown if userRepository.save fails.
      const inputUser: IUser = {
        _id: new ObjectId(),
        email: 'error@example.com',
        password: 'errorpass',
      };

      const error = new Error('Database error');

      jest.mocked(mockUserRepository.create).mockRejectedValue(error as never);

      await expect(mockUserService.registerUser(inputUser as any)).resolves.toEqual({"code": 500, "email": undefined, "message": "mongo error!", "username": undefined});
      expect(mockUserRepository.create).toHaveBeenCalledWith(inputUser as any);
    });

    */

    test('should handle user creation with empty string fields', async () => {
      // This test ensures that a user with empty string fields is handled correctly.
      const inputUser: IUser = {
        email: '',
        password: '',
        username: '',
        phone: '',
      };

      const createdUser = {
        ...inputUser,
        createdAt: new Date(),
      };
      delete createdUser.password

      jest.mocked(mockUserRepository.create).mockResolvedValue(createdUser as any);

      const result = await mockUserService.registerUser(inputUser as any);

      expect(mockUserRepository.create).toHaveBeenCalledWith(inputUser as any);
      expect(result).toEqual(createdUser);
    });

    test('should handle user creation with zero failedLogins', async () => {
      // This test ensures that a user with failedLogins set to zero is handled correctly.
      const inputUser: IUser = {
        email: 'zero@example.com',
        password: 'zeropass',
        failedLogins: 0,
      };

      const createdUser = {
        ...inputUser,
        _id: new ObjectId(),
        createdAt: new Date(),
      };

      delete createdUser.password


      jest.mocked(mockUserRepository.create).mockResolvedValue(createdUser as any);

      const result = await mockUserService.registerUser(inputUser as any);

      expect(mockUserRepository.create).toHaveBeenCalledWith(inputUser as any);
      expect(result).toEqual(createdUser);
    });
  });


  
});
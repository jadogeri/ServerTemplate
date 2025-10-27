
import { Model } from "mongoose";
import { UserRegisterRequestDTO } from "../../dtos/request/UserRegisterRequestDTO";
import UserRepository from '../UserRepository';


// UserRepository.create.spec.ts


// UserRepository.create.spec.ts
// Manual mock for IUser
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

// Manual mock for mongoose.Types.ObjectId
class MockObjectId {
  private static _id = 1;
  public id: number;
  constructor() {
    this.id = MockObjectId._id++;
  }
  toString() {
    return `mock-object-id-${this.id}`;
  }
}

// Manual mock for mongoose

// Manual mock for Model<IUser>
class MockUserModel {
  public create = jest.fn();
}

describe('UserRepository.create() create method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should create a user successfully with all required fields', async () => {
      // This test aims to verify that a user is created successfully when all required fields are provided.
      const mockUserModel = new MockUserModel();
      const input: UserRegisterRequestDTO = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'securepassword',
        phone: '1234567890',
      };

      const createdUser: MockIUser = {
        ...input,
        isEnabled: true,
        failedLogins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: new MockObjectId(),
      };

      jest.mocked(mockUserModel.create).mockResolvedValue(createdUser as any);

      const repo = new UserRepository(mockUserModel as any as Model<any>);
      const result = await repo.create(input);

      expect(mockUserModel.create).toHaveBeenCalledWith(input as any);
      expect(result).toEqual(createdUser as any);
    });

    it('should create a user with extra fields in DTO (should ignore them)', async () => {
      // This test aims to verify that extra fields in the DTO are ignored and do not cause errors.
      const mockUserModel = new MockUserModel();
      const input = {
        username: 'extrafielduser',
        email: 'extra@example.com',
        password: 'password',
        phone: '5555555555',
        extraField: 'shouldBeIgnored',
      } as any;

      const createdUser: MockIUser = {
        username: 'extrafielduser',
        email: 'extra@example.com',
        password: 'password',
        phone: '5555555555',
        isEnabled: false,
        failedLogins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: new MockObjectId(),
      };

      jest.mocked(mockUserModel.create).mockResolvedValue(createdUser as any);

      const repo = new UserRepository(mockUserModel as any as Model<any>);
      const result = await repo.create(input);

      expect(mockUserModel.create).toHaveBeenCalledWith(input as any);
      expect(result).toEqual(createdUser as any);
    });

    it('should pass the user DTO as IUser to the model', async () => {
      // This test aims to verify that the user DTO is cast and passed as IUser to the model's create method.
      const mockUserModel = new MockUserModel();
      const input: UserRegisterRequestDTO = {
        username: 'castuser',
        email: 'cast@example.com',
        password: 'castpassword',
        phone: '1112223333',
      };

      const createdUser: MockIUser = {
        ...input,
        _id: new MockObjectId(),
      };

      jest.mocked(mockUserModel.create).mockResolvedValue(createdUser as any);

      const repo = new UserRepository(mockUserModel as any as Model<any>);
      await repo.create(input);

      expect(mockUserModel.create).toHaveBeenCalledWith(input as any);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw an error if the model create method throws (e.g., validation error)', async () => {
      // This test aims to verify that errors thrown by the model's create method are propagated.
      const mockUserModel = new MockUserModel();
      const input: UserRegisterRequestDTO = {
        username: 'erroruser',
        email: 'error@example.com',
        password: 'errorpassword',
        phone: '0000000000',
      };

      const error = new Error('Validation failed');
      jest.mocked(mockUserModel.create).mockRejectedValue(error as never);

      const repo = new UserRepository(mockUserModel as any as Model<any>);

      await expect(repo.create(input)).rejects.toThrow('Validation failed');
      expect(mockUserModel.create).toHaveBeenCalledWith(input as any);
    });

    it('should handle user DTO with minimal valid data (boundary test)', async () => {
      // This test aims to verify that the method works with the minimal valid data for a user.
      const mockUserModel = new MockUserModel();
      const input: UserRegisterRequestDTO = {
        username: 'minuser',
        email: 'min@example.com',
        password: 'minpass',
        phone: '1',
      };

      const createdUser: MockIUser = {
        ...input,
        _id: new MockObjectId(),
      };

      jest.mocked(mockUserModel.create).mockResolvedValue(createdUser as any);

      const repo = new UserRepository(mockUserModel as any as Model<any>);
      const result = await repo.create(input);

      expect(mockUserModel.create).toHaveBeenCalledWith(input as any);
      expect(result).toEqual(createdUser as any);
    });

    it('should handle user DTO with very long strings (boundary test)', async () => {
      // This test aims to verify that the method can handle very long string values in the DTO.
      const mockUserModel = new MockUserModel();
      const longString = 'a'.repeat(1000);
      const input: UserRegisterRequestDTO = {
        username: longString,
        email: `${longString}@example.com`,
        password: longString,
        phone: longString,
      };

      const createdUser: MockIUser = {
        ...input,
        _id: new MockObjectId(),
      };

      jest.mocked(mockUserModel.create).mockResolvedValue(createdUser as any);

      const repo = new UserRepository(mockUserModel as any as Model<any>);
      const result = await repo.create(input);

      expect(mockUserModel.create).toHaveBeenCalledWith(input as any);
      expect(result).toEqual(createdUser as any);
    });

    it('should handle user DTO with special characters', async () => {
      // This test aims to verify that the method can handle special characters in the DTO fields.
      const mockUserModel = new MockUserModel();
      const input: UserRegisterRequestDTO = {
        username: 'user!@#$%^&*()',
        email: 'special+chars@example.com',
        password: 'p@$$w0rd!',
        phone: '+1-800-555-0199',
      };

      const createdUser: MockIUser = {
        ...input,
        _id: new MockObjectId(),
      };

      jest.mocked(mockUserModel.create).mockResolvedValue(createdUser as any);

      const repo = new UserRepository(mockUserModel as any as Model<any>);
      const result = await repo.create(input);

      expect(mockUserModel.create).toHaveBeenCalledWith(input as any);
      expect(result).toEqual(createdUser as any);
    });
  });
});
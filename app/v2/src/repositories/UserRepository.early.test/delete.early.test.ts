
import { Model } from "mongoose";
import UserRepository from '../UserRepository';


// UserRepository.delete.spec.ts


// UserRepository.delete.spec.ts
// Manual mock for mongoose.Types.ObjectId
class MockObjectId {
  public value: string = '507f1f77bcf86cd799439011';
  constructor(){}
  toHexString(): string {
    return this.value;
  }
}

// Manual mock for IUser
interface MockIUser {
  _id?: MockObjectId;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  isEnabled?: boolean;
  failedLogins?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Manual mock for mongoose

describe('UserRepository.delete() delete method', () => {
  // Happy Paths
  describe('Happy Paths', () => {
    it('should delete a user and return the deleted user document when user exists', async () => {
      // This test ensures that when a valid user ID is provided and the user exists, the deleted user document is returned.

      // Arrange
      const mockDeletedUser: MockIUser = {
        _id: new MockObjectId(),
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        phone: '1234567890',
        isEnabled: true,
        failedLogins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFindByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedUser as any as never);
      const mockUserModel = {
        findByIdAndDelete: mockFindByIdAndDelete,
      } as unknown as jest.Mocked<Model<MockIUser>>;

      const userRepository = new UserRepository(mockUserModel as any);

      const mockId = new MockObjectId();

      // Act
      const result = await userRepository.delete(mockId as any);

      // Assert
      expect(jest.mocked(mockFindByIdAndDelete)).toHaveBeenCalledWith(mockId as any);
      expect(result).toBe(mockDeletedUser as any);
    });

    it('should call findByIdAndDelete with the correct ObjectId', async () => {
      // This test ensures that the method is called with the exact ObjectId provided.

      // Arrange
      const mockFindByIdAndDelete = jest.fn().mockResolvedValue({} as any as never);
      const mockUserModel = {
        findByIdAndDelete: mockFindByIdAndDelete,
      } as unknown as jest.Mocked<Model<MockIUser>>;

      const userRepository = new UserRepository(mockUserModel as any);

      const mockId = new MockObjectId();

      // Act
      await userRepository.delete(mockId as any);

      // Assert
      expect(jest.mocked(mockFindByIdAndDelete)).toHaveBeenCalledTimes(1);
      expect(jest.mocked(mockFindByIdAndDelete)).toHaveBeenCalledWith(mockId as any);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should return null if the user does not exist', async () => {
      // This test ensures that if the user does not exist, the method returns null.

      // Arrange
      const mockFindByIdAndDelete = jest.fn().mockResolvedValue(null);
      const mockUserModel = {
        findByIdAndDelete: mockFindByIdAndDelete,
      } as unknown as jest.Mocked<Model<MockIUser>>;

      const userRepository = new UserRepository(mockUserModel as any);

      const mockId = new MockObjectId();

      // Act
      const result = await userRepository.delete(mockId as any);

      // Assert
      expect(jest.mocked(mockFindByIdAndDelete)).toHaveBeenCalledWith(mockId as any);
      expect(result).toBeNull();
    });

    it('should propagate errors thrown by findByIdAndDelete', async () => {
      // This test ensures that if findByIdAndDelete throws an error, it is propagated by the delete method.

      // Arrange
      const error = new Error('Database error');
      const mockFindByIdAndDelete = jest.fn().mockRejectedValue(error as never);
      const mockUserModel = {
        findByIdAndDelete: mockFindByIdAndDelete,
      } as unknown as jest.Mocked<Model<MockIUser>>;

      const userRepository = new UserRepository(mockUserModel as any);

      const mockId = new MockObjectId();

      // Act & Assert
      await expect(userRepository.delete(mockId as any)).rejects.toThrow('Database error');
      expect(jest.mocked(mockFindByIdAndDelete)).toHaveBeenCalledWith(mockId as any);
    });

    it('should handle ObjectId with unusual but valid values', async () => {
      // This test ensures that the method works with an ObjectId that has an unusual but valid value.

      // Arrange
      class CustomMockObjectId extends MockObjectId {
        value = '000000000000000000000001';

        constructor(){
          super();
        }
        toHexString(): string {
          return this.value;
        }
      }
      const customId = new CustomMockObjectId();

      const mockDeletedUser: MockIUser = {
        _id: customId,
        username: 'edgeuser',
        email: 'edge@example.com',
      };

      const mockFindByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedUser as any as never);
      const mockUserModel = {
        findByIdAndDelete: mockFindByIdAndDelete,
      } as unknown as jest.Mocked<Model<MockIUser>>;

      const userRepository = new UserRepository(mockUserModel as any);

      // Act
      const result = await userRepository.delete(customId as any);

      // Assert
      expect(jest.mocked(mockFindByIdAndDelete)).toHaveBeenCalledWith(customId as any);
      expect(result).toBe(mockDeletedUser as any);
    });

    it('should work if user document has minimal fields', async () => {
      // This test ensures that the method works even if the deleted user document has only minimal fields.

      // Arrange
      const minimalUser: MockIUser = {
        _id: new MockObjectId(),
      };

      const mockFindByIdAndDelete = jest.fn().mockResolvedValue(minimalUser as any as never);
      const mockUserModel = {
        findByIdAndDelete: mockFindByIdAndDelete,
      } as unknown as jest.Mocked<Model<MockIUser>>;

      const userRepository = new UserRepository(mockUserModel as any);

      const mockId = new MockObjectId();

      // Act
      const result = await userRepository.delete(mockId as any);

      // Assert
      expect(jest.mocked(mockFindByIdAndDelete)).toHaveBeenCalledWith(mockId as any);
      expect(result).toBe(minimalUser as any);
    });
  });
});
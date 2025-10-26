
import UserRepository from '../UserRepository';
import UserModel from '../../models/UserModel';


// UserRepository.delete.spec.ts
// Manual mocks for dependencies

// Mock for mongoose.Types.ObjectId
class MockObjectId {
  // Simulate ObjectId methods if needed
  public toHexString = jest.fn().mockReturnValue('mockedObjectIdHex');
}
const mockObjectId = {
  toHexString: jest.fn(),
} as unknown as jest.Mocked<MockObjectId>;

// Mock for IUser interface
interface MockIUser {
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  isEnabled?: boolean;
  failedLogins?: number;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: MockObjectId;
}

// Mock for User model
class MockUser {
  public static findByIdAndDelete = jest.fn();
}

// Replace actual User import with our mock
jest.mock("../../models/UserModel", () => ({
  __esModule: true,
  default: MockUser,
}));

describe('UserRepository.delete() delete method', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository(UserModel);
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should delete a user and return the deleted user document when user exists', async () => {
      // This test ensures that when a valid ObjectId is provided and the user exists, the deleted user document is returned.

      const mockDeletedUser: MockIUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        phone: '1234567890',
        isEnabled: true,
        failedLogins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: mockObjectId as any,
      };

      jest.mocked(MockUser.findByIdAndDelete).mockResolvedValue(mockDeletedUser as any as never);

      const result = await userRepository.delete(mockObjectId as any);

      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
      expect(result).toEqual(mockDeletedUser as any);
    });

    it('should return null when trying to delete a user that does not exist', async () => {
      // This test ensures that when a valid ObjectId is provided but the user does not exist, null is returned.

      jest.mocked(MockUser.findByIdAndDelete).mockResolvedValue(null);

      const result = await userRepository.delete(mockObjectId as any);

      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
      expect(result).toBeNull();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle when ObjectId is a different instance but valid', async () => {
      // This test ensures that the method works with any valid ObjectId instance, not just a specific mock.

      const anotherMockObjectId = {
        toHexString: jest.fn().mockReturnValue('anotherMockedObjectIdHex'),
      } as unknown as jest.Mocked<MockObjectId>;

      const mockDeletedUser: MockIUser = {
        username: 'edgeuser',
        email: 'edge@example.com',
        password: 'edgepassword',
        phone: '0987654321',
        isEnabled: false,
        failedLogins: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: anotherMockObjectId as any,
      };

      jest.mocked(MockUser.findByIdAndDelete).mockResolvedValue(mockDeletedUser as any as never);

      const result = await userRepository.delete(anotherMockObjectId as any);

      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(anotherMockObjectId as any);
      expect(result).toEqual(mockDeletedUser as any);
    });

    it('should propagate errors thrown by User.findByIdAndDelete', async () => {
      // This test ensures that if the underlying User model throws an error, it is propagated by the delete method.

      const error = new Error('Database error');
      jest.mocked(MockUser.findByIdAndDelete).mockRejectedValue(error as never);

      await expect(userRepository.delete(mockObjectId as any)).rejects.toThrow('Database error');
      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
    });

    it('should handle ObjectId with unusual but valid structure', async () => {
      // This test ensures that the method can handle ObjectId objects with extra properties.

      const weirdMockObjectId = {
        toHexString: jest.fn().mockReturnValue('weirdMockedObjectIdHex'),
        extraProp: 'extra',
      } as unknown as jest.Mocked<MockObjectId>;

      const mockDeletedUser: MockIUser = {
        username: 'weirduser',
        email: 'weird@example.com',
        password: 'weirdpassword',
        phone: '1112223333',
        isEnabled: true,
        failedLogins: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: weirdMockObjectId as any,
      };

      jest.mocked(MockUser.findByIdAndDelete).mockResolvedValue(mockDeletedUser as any as never);

      const result = await userRepository.delete(weirdMockObjectId as any);

      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(weirdMockObjectId as any);
      expect(result).toEqual(mockDeletedUser as any);
    });
  });
});
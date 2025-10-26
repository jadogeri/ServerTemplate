
import UserRepository from '../UserRepository';


// UserRepository.remove unit tests
// Manual mocks for dependencies
class Mockmongoose {
  public Types = {
    ObjectId: class MockObjectId {
      // Simulate ObjectId methods if needed
      toHexString = jest.fn().mockReturnValue('mockedObjectIdString');
      equals = jest.fn().mockReturnValue(true);
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
  _id?: any; // Use any for ObjectId
}

class MockUser {
  // Simulate the static method findByIdAndDelete
  static findByIdAndDelete = jest.fn();
}

// Replace actual imports with mocks
jest.mock("../../models/UserModel", () => ({
  __esModule: true,
  default: MockUser,
}));

describe('UserRepository.remove() remove method', () => {
  let userRepository: UserRepository;
  let mockObjectId: jest.Mocked<InstanceType<typeof Mockmongoose['Types']['ObjectId']>>;

  beforeEach(() => {
    userRepository = new UserRepository();
    // Create a new mock ObjectId for each test
    mockObjectId = new Mockmongoose().Types.ObjectId as any;
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should delete a user and return the deleted user document when user exists', async () => {
      // Test: Ensure remove returns the deleted user when found
      const mockDeletedUser: MockIUser = {
        _id: mockObjectId,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        phone: '1234567890',
        isEnabled: true,
        failedLogins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.mocked(MockUser.findByIdAndDelete).mockResolvedValue(mockDeletedUser as any as never);

      const result = await userRepository.remove(mockObjectId as any);

      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
      expect(result).toEqual(mockDeletedUser as any);
    });

    it('should call findByIdAndDelete with the correct ObjectId', async () => {
      // Test: Ensure correct ObjectId is passed to findByIdAndDelete
      jest.mocked(MockUser.findByIdAndDelete).mockResolvedValue({} as any as never);

      await userRepository.remove(mockObjectId as any);

      expect(MockUser.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return null when no user is found for the given ObjectId', async () => {
      // Test: Ensure remove returns null if user not found
      jest.mocked(MockUser.findByIdAndDelete).mockResolvedValue(null);

      const result = await userRepository.remove(mockObjectId as any);

      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
      expect(result).toBeNull();
    });

    it('should handle ObjectId with unusual values', async () => {
      // Test: Ensure remove works with an ObjectId with custom toHexString
      const customObjectId = {
        toHexString: jest.fn().mockReturnValue('customHex'),
        equals: jest.fn().mockReturnValue(true),
      } as any;

      jest.mocked(MockUser.findByIdAndDelete).mockResolvedValue({ _id: customObjectId } as any as never);

      const result = await userRepository.remove(customObjectId as any);

      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(customObjectId as any);
      expect(result).toEqual({ _id: customObjectId } as any);
    });

    it('should propagate errors thrown by findByIdAndDelete', async () => {
      // Test: Ensure remove throws if findByIdAndDelete throws
      const error = new Error('Database error');
      jest.mocked(MockUser.findByIdAndDelete).mockRejectedValue(error as never);

      await expect(userRepository.remove(mockObjectId as any)).rejects.toThrow('Database error');
      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
    });

    it('should handle ObjectId with missing methods gracefully', async () => {
      // Test: Ensure remove works if ObjectId is a plain object
      const plainObjectId = { id: 'plain' } as any;
      jest.mocked(MockUser.findByIdAndDelete).mockResolvedValue({ _id: plainObjectId } as any as never);

      const result = await userRepository.remove(plainObjectId as any);

      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith(plainObjectId as any);
      expect(result).toEqual({ _id: plainObjectId } as any);
    });
  });
});
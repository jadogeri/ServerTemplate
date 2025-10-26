
import UserRepository from '../UserRepository';


// Manual mocks for dependencies
// MockIUser interface
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

// Mockmongoose class with ObjectId
class MockObjectId {
  public id: string = '507f1f77bcf86cd799439011';
  toHexString(): string {
    return this.id;
  }
}
const mockObjectId = {
  id: '507f1f77bcf86cd799439011',
  toHexString: jest.fn().mockReturnValue('507f1f77bcf86cd799439011'),
} as unknown as jest.Mocked<MockObjectId>;

// MockUser class with static findOneAndUpdate
class MockUser {
  static findOneAndUpdate = jest.fn();
}

// Replace actual User import with our mock
jest.mock("../../models/UserModel", () => ({
  __esModule: true,
  default: MockUser,
}));

describe('UserRepository.update() update method', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should update an existing user and return the updated user document', async () => {
      // Test: Update with all fields present
      // Arrange
      const mockUserData: MockIUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'securepassword',
        phone: '1234567890',
        isEnabled: true,
        failedLogins: 0,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z'),
        _id: mockObjectId,
      };
      const mockUpdatedUser = { ...mockUserData, updatedAt: new Date() };
      jest.mocked(MockUser.findOneAndUpdate).mockResolvedValue(mockUpdatedUser as any as never);

      // Act
      const result = await userRepository.update(mockObjectId as any, mockUserData as any);

      // Assert
      expect(MockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUserData as any },
        { upsert: true }
      );
      expect(result).toEqual(mockUpdatedUser as any);
    });

    it('should create a new user if user does not exist (upsert)', async () => {
      // Test: Upsert creates new user
      // Arrange
      const mockUserData: MockIUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword',
        phone: '9876543210',
      };
      const mockCreatedUser = { ...mockUserData, _id: mockObjectId };
      jest.mocked(MockUser.findOneAndUpdate).mockResolvedValue(mockCreatedUser as any as never);

      // Act
      const result = await userRepository.update(mockObjectId as any, mockUserData as any);

      // Assert
      expect(MockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUserData as any },
        { upsert: true }
      );
      expect(result).toEqual(mockCreatedUser as any);
    });

    it('should update user with partial fields (only username and email)', async () => {
      // Test: Update with partial fields
      // Arrange
      const mockUserData: MockIUser = {
        username: 'partialuser',
        email: 'partial@example.com',
      };
      const mockUpdatedUser = { ...mockUserData, _id: mockObjectId };
      jest.mocked(MockUser.findOneAndUpdate).mockResolvedValue(mockUpdatedUser as any as never);

      // Act
      const result = await userRepository.update(mockObjectId as any, mockUserData as any);

      // Assert
      expect(MockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUserData as any },
        { upsert: true }
      );
      expect(result).toEqual(mockUpdatedUser as any);
    });

    it('should update user when failedLogins is incremented', async () => {
      // Test: Update with failedLogins increment
      // Arrange
      const mockUserData: MockIUser = {
        failedLogins: 5,
      };
      const mockUpdatedUser = { ...mockUserData, _id: mockObjectId };
      jest.mocked(MockUser.findOneAndUpdate).mockResolvedValue(mockUpdatedUser as any as never);

      // Act
      const result = await userRepository.update(mockObjectId as any, mockUserData as any);

      // Assert
      expect(MockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUserData as any },
        { upsert: true }
      );
      expect(result).toEqual(mockUpdatedUser as any);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle update when user data is empty object', async () => {
      // Test: Update with empty user object
      // Arrange
      const mockUserData: MockIUser = {};
      const mockUpdatedUser = { _id: mockObjectId };
      jest.mocked(MockUser.findOneAndUpdate).mockResolvedValue(mockUpdatedUser as any as never);

      // Act
      const result = await userRepository.update(mockObjectId as any, mockUserData as any);

      // Assert
      expect(MockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUserData as any },
        { upsert: true }
      );
      expect(result).toEqual(mockUpdatedUser as any);
    });

    it('should handle update when user data contains only _id', async () => {
      // Test: Update with only _id field
      // Arrange
      const mockUserData: MockIUser = { _id: mockObjectId };
      const mockUpdatedUser = { _id: mockObjectId };
      jest.mocked(MockUser.findOneAndUpdate).mockResolvedValue(mockUpdatedUser as any as never);

      // Act
      const result = await userRepository.update(mockObjectId as any, mockUserData as any);

      // Assert
      expect(MockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUserData as any },
        { upsert: true }
      );
      expect(result).toEqual(mockUpdatedUser as any);
    });

    it('should throw error if findOneAndUpdate rejects (database error)', async () => {
      // Test: Simulate database error
      // Arrange
      const mockUserData: MockIUser = {
        username: 'erroruser',
        email: 'error@example.com',
      };
      const mockError = new Error('Database error');
      jest.mocked(MockUser.findOneAndUpdate).mockRejectedValue(mockError as never);

      // Act & Assert
      await expect(
        userRepository.update(mockObjectId as any, mockUserData as any)
      ).rejects.toThrow('Database error');
      expect(MockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUserData as any },
        { upsert: true }
      );
    });

    it('should handle update when user data contains unexpected extra fields', async () => {
      // Test: Update with extra fields not in IUser
      // Arrange
      const mockUserData: MockIUser & { extraField: string } = {
        username: 'extrafielduser',
        extraField: 'unexpected',
      };
      const mockUpdatedUser = { ...mockUserData, _id: mockObjectId };
      jest.mocked(MockUser.findOneAndUpdate).mockResolvedValue(mockUpdatedUser as any as never);

      // Act
      const result = await userRepository.update(mockObjectId as any, mockUserData as any);

      // Assert
      expect(MockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUserData as any },
        { upsert: true }
      );
      expect(result).toEqual(mockUpdatedUser as any);
    });

    it('should handle update when ObjectId is a string instead of an object', async () => {
      // Test: ObjectId as string
      // Arrange
      const stringObjectId = '507f1f77bcf86cd799439011';
      const mockUserData: MockIUser = {
        username: 'stringiduser',
      };
      const mockUpdatedUser = { ...mockUserData, _id: stringObjectId };
      jest.mocked(MockUser.findOneAndUpdate).mockResolvedValue(mockUpdatedUser as any as never);

      // Act
      const result = await userRepository.update(stringObjectId as any, mockUserData as any);

      // Assert
      expect(MockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: stringObjectId as any },
        { $set: mockUserData as any },
        { upsert: true }
      );
      expect(result).toEqual(mockUpdatedUser as any);
    });
  });
});
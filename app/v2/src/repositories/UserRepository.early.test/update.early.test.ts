
import UserRepository from '../UserRepository';


// UserRepository.update.spec.ts


// UserRepository.update.spec.ts
// Manual mock for mongoose.Types.ObjectId
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
  _id?: MockObjectId;
}

// Manual mock for mongoose.Model<IUser>
class MockModel {
  public findOneAndUpdate = jest.fn();
}

describe('UserRepository.update() update method', () => {
  let mockUserModel: MockModel;
  let userRepository: UserRepository;

  beforeEach(() => {
    mockUserModel = new MockModel();
    userRepository = new UserRepository(mockUserModel as any);
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should update an existing user and return the updated user document', async () => {
      // Test: Update with all fields present, expect correct call and return value
      const mockUser: MockIUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        isEnabled: true,
        failedLogins: 0,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        _id: mockObjectId,
      };

      const updatedUserDoc = { ...mockUser, updatedAt: new Date() };

      jest.mocked(mockUserModel.findOneAndUpdate).mockResolvedValue(updatedUserDoc as any as never);

      const result = await userRepository.update(mockObjectId as any, mockUser as any);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUser as any },
        { upsert: true }
      );
      expect(result).toEqual(updatedUserDoc);
    });

    it('should create a new user if user does not exist (upsert)', async () => {
      // Test: Upsert behavior, returns new user document
      const mockUser: MockIUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword',
        phone: '9876543210',
      };

      const createdUserDoc = { ...mockUser, _id: mockObjectId };

      jest.mocked(mockUserModel.findOneAndUpdate).mockResolvedValue(createdUserDoc as any as never);

      const result = await userRepository.update(mockObjectId as any, mockUser as any);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUser as any },
        { upsert: true }
      );
      expect(result).toEqual(createdUserDoc);
    });

    it('should update user with partial fields (only username and email)', async () => {
      // Test: Update with only some fields present
      const mockUser: MockIUser = {
        username: 'partialuser',
        email: 'partial@example.com',
      };

      const updatedUserDoc = { ...mockUser, _id: mockObjectId };

      jest.mocked(mockUserModel.findOneAndUpdate).mockResolvedValue(updatedUserDoc as any as never);

      const result = await userRepository.update(mockObjectId as any, mockUser as any);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUser as any },
        { upsert: true }
      );
      expect(result).toEqual(updatedUserDoc);
    });

    it('should update user when _id is a valid ObjectId instance', async () => {
      // Test: _id is a valid ObjectId, expect correct call
      const mockUser: MockIUser = {
        username: 'objectiduser',
        email: 'objectid@example.com',
      };

      const updatedUserDoc = { ...mockUser, _id: mockObjectId };

      jest.mocked(mockUserModel.findOneAndUpdate).mockResolvedValue(updatedUserDoc as any as never);

      const result = await userRepository.update(mockObjectId as any, mockUser as any);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUser as any },
        { upsert: true }
      );
      expect(result).toEqual(updatedUserDoc);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle update when user object is empty', async () => {
      // Test: Update with empty user object
      const mockUser: MockIUser = {};

      const updatedUserDoc = { ...mockUser, _id: mockObjectId };

      jest.mocked(mockUserModel.findOneAndUpdate).mockResolvedValue(updatedUserDoc as any as never);

      const result = await userRepository.update(mockObjectId as any, mockUser as any);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUser as any },
        { upsert: true }
      );
      expect(result).toEqual(updatedUserDoc);
    });

    it('should handle update when user object has only _id field', async () => {
      // Test: Update with only _id field in user object
      const mockUser: MockIUser = {
        _id: mockObjectId,
      };

      const updatedUserDoc = { ...mockUser };

      jest.mocked(mockUserModel.findOneAndUpdate).mockResolvedValue(updatedUserDoc as any as never);

      const result = await userRepository.update(mockObjectId as any, mockUser as any);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUser as any },
        { upsert: true }
      );
      expect(result).toEqual(updatedUserDoc);
    });

    it('should handle update when user object has unexpected extra fields', async () => {
      // Test: Update with extra fields not defined in IUser
      const mockUser: MockIUser & { extraField: string } = {
        username: 'extrafielduser',
        extraField: 'unexpected',
      };

      const updatedUserDoc = { ...mockUser, _id: mockObjectId };

      jest.mocked(mockUserModel.findOneAndUpdate).mockResolvedValue(updatedUserDoc as any as never);

      const result = await userRepository.update(mockObjectId as any, mockUser as any);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUser as any },
        { upsert: true }
      );
      expect(result).toEqual(updatedUserDoc);
    });

    it('should propagate error if findOneAndUpdate throws', async () => {
      // Test: Simulate a database error and ensure it is thrown
      const mockUser: MockIUser = {
        username: 'erroruser',
        email: 'error@example.com',
      };

      const error = new Error('Database error');
      jest.mocked(mockUserModel.findOneAndUpdate).mockRejectedValue(error as never);

      await expect(userRepository.update(mockObjectId as any, mockUser as any)).rejects.toThrow('Database error');
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUser as any },
        { upsert: true }
      );
    });

    it('should handle update when user object has only boolean and number fields', async () => {
      // Test: Update with only isEnabled and failedLogins fields
      const mockUser: MockIUser = {
        isEnabled: false,
        failedLogins: 5,
      };

      const updatedUserDoc = { ...mockUser, _id: mockObjectId };

      jest.mocked(mockUserModel.findOneAndUpdate).mockResolvedValue(updatedUserDoc as any as never);

      const result = await userRepository.update(mockObjectId as any, mockUser as any);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUser as any },
        { upsert: true }
      );
      expect(result).toEqual(updatedUserDoc);
    });

    it('should handle update when user object has only date fields', async () => {
      // Test: Update with only createdAt and updatedAt fields
      const mockUser: MockIUser = {
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-02'),
      };

      const updatedUserDoc = { ...mockUser, _id: mockObjectId };

      jest.mocked(mockUserModel.findOneAndUpdate).mockResolvedValue(updatedUserDoc as any as never);

      const result = await userRepository.update(mockObjectId as any, mockUser as any);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockObjectId as any },
        { $set: mockUser as any },
        { upsert: true }
      );
      expect(result).toEqual(updatedUserDoc);
    });
  });
});

import UserRepository from '../UserRepository';


// UserRepository.remove.spec.ts


// UserRepository.remove.spec.ts
// Manual mock for mongoose.Types.ObjectId
class MockObjectId {
  private value: string = '507f1f77bcf86cd799439011';
  toHexString(): string {
    return this.value;
  }
}
const mockObjectId = {
  toHexString: jest.fn().mockReturnValue('507f1f77bcf86cd799439011'),
} as unknown as jest.Mocked<MockObjectId>;

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

// Manual mock for mongoose.Model<IUser>
class MockmongooseModel {
  public findByIdAndDelete = jest.fn();
}

// All tests for remove are organized under a single describe block
describe('UserRepository.remove() remove method', () => {
  let mockUserModel: MockmongooseModel;
  let userRepository: UserRepository;

  beforeEach(() => {
    mockUserModel = new MockmongooseModel();
    userRepository = new UserRepository(mockUserModel as any);
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should delete and return the user when a valid ObjectId is provided', async () => {
      // This test aims to verify that remove returns the deleted user when a valid ObjectId is given.
      const mockUser: MockIUser = {
        _id: mockObjectId as any,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        phone: '1234567890',
        isEnabled: true,
        failedLogins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.mocked(mockUserModel.findByIdAndDelete).mockResolvedValue(mockUser as any as never);

      const result = await userRepository.remove(mockObjectId as any);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
      expect(result).toBe(mockUser as any);
    });

    it('should call findByIdAndDelete exactly once with the correct ObjectId', async () => {
      // This test aims to ensure findByIdAndDelete is called once with the correct ObjectId.
      const mockUser: MockIUser = { _id: mockObjectId as any };
      jest.mocked(mockUserModel.findByIdAndDelete).mockResolvedValue(mockUser as any as never);

      await userRepository.remove(mockObjectId as any);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return null if no user is found for the given ObjectId', async () => {
      // This test aims to verify that remove returns null if the user does not exist.
      jest.mocked(mockUserModel.findByIdAndDelete).mockResolvedValue(null);

      const result = await userRepository.remove(mockObjectId as any);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
      expect(result).toBeNull();
    });

    it('should propagate errors thrown by findByIdAndDelete', async () => {
      // This test aims to ensure that errors from findByIdAndDelete are propagated.
      const error = new Error('Database error');
      jest.mocked(mockUserModel.findByIdAndDelete).mockRejectedValue(error as never);

      await expect(userRepository.remove(mockObjectId as any)).rejects.toThrow('Database error');
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
    });

    it('should handle ObjectId with unusual but valid string values', async () => {
      // This test aims to verify that remove works with unusual but valid ObjectId values.
      const unusualObjectId = {
        toHexString: jest.fn().mockReturnValue('000000000000000000000000'),
      } as unknown as jest.Mocked<MockObjectId>;
      const mockUser: MockIUser = { _id: unusualObjectId as any };
      jest.mocked(mockUserModel.findByIdAndDelete).mockResolvedValue(mockUser as any as never);

      const result = await userRepository.remove(unusualObjectId as any);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(unusualObjectId as any);
      expect(result).toBe(mockUser as any);
    });

    it('should work if the user document returned is missing optional fields', async () => {
      // This test aims to verify that remove works even if the returned user is missing optional fields.
      const minimalUser: MockIUser = { _id: mockObjectId as any };
      jest.mocked(mockUserModel.findByIdAndDelete).mockResolvedValue(minimalUser as any as never);

      const result = await userRepository.remove(mockObjectId as any);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(mockObjectId as any);
      expect(result).toBe(minimalUser as any);
    });
  });
});
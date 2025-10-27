
import UserRepository from '../UserRepository';


// UserRepository.findByEmail.spec.ts
// Manual mock for mongoose ObjectId
class MockObjectId {
  private id: string;
  constructor(id: string = '507f1f77bcf86cd799439011') {
    this.id = id;
  }
  toString() {
    return this.id;
  }
}

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

// Manual mock for mongoose Model
class Mockmongoose {
  public findOne = jest.fn();
}

describe('UserRepository.findByEmail() findByEmail method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return a user when a user with the given email exists', async () => {
      // This test ensures that findByEmail returns the correct user when found.
      const mockUser: MockIUser = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        phone: '1234567890',
        isEnabled: true,
        failedLogins: 0,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z'),
        _id: new MockObjectId('507f1f77bcf86cd799439011'),
      };

      const mockModel = new Mockmongoose();
      jest.mocked(mockModel.findOne).mockResolvedValue(mockUser as any as never);

      const repo = new UserRepository(mockModel as any);

      const result = await repo.findByEmail('john@example.com');
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(result).toEqual(mockUser as any);
    });

    it('should return a user with minimal fields when found', async () => {
      // This test ensures that findByEmail works with a user object with only required fields.
      const mockUser: MockIUser = {
        email: 'minimal@example.com',
        _id: new MockObjectId('507f1f77bcf86cd799439012'),
      };

      const mockModel = new Mockmongoose();
      jest.mocked(mockModel.findOne).mockResolvedValue(mockUser as any as never);

      const repo = new UserRepository(mockModel as any);

      const result = await repo.findByEmail('minimal@example.com');
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: 'minimal@example.com' });
      expect(result).toEqual(mockUser as any);
    });

    it('should call findOne with the correct email filter', async () => {
      // This test ensures that findByEmail passes the correct filter to findOne.
      const mockModel = new Mockmongoose();
      jest.mocked(mockModel.findOne).mockResolvedValue({} as any as never);

      const repo = new UserRepository(mockModel as any);

      await repo.findByEmail('test@example.com');
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return null when no user is found with the given email', async () => {
      // This test ensures that findByEmail returns null when no user is found.
      const mockModel = new Mockmongoose();
      jest.mocked(mockModel.findOne).mockResolvedValue(null as any as never);

      const repo = new UserRepository(mockModel as any);

      const result = await repo.findByEmail('notfound@example.com');
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: 'notfound@example.com' });
      expect(result).toBeNull();
    });

    it('should handle empty string as email and call findOne with empty email', async () => {
      // This test ensures that findByEmail can handle an empty string as email.
      const mockModel = new Mockmongoose();
      jest.mocked(mockModel.findOne).mockResolvedValue(null as any as never);

      const repo = new UserRepository(mockModel as any);

      const result = await repo.findByEmail('');
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: '' });
      expect(result).toBeNull();
    });

    it('should handle email with unusual characters', async () => {
      // This test ensures that findByEmail can handle emails with special characters.
      const specialEmail = 'weird+chars!@example.com';
      const mockUser: MockIUser = {
        email: specialEmail,
        _id: new MockObjectId('507f1f77bcf86cd799439013'),
      };

      const mockModel = new Mockmongoose();
      jest.mocked(mockModel.findOne).mockResolvedValue(mockUser as any as never);

      const repo = new UserRepository(mockModel as any);

      const result = await repo.findByEmail(specialEmail);
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: specialEmail });
      expect(result).toEqual(mockUser as any);
    });

    it('should propagate errors thrown by the underlying model', async () => {
      // This test ensures that findByEmail propagates errors from the model.
      const mockModel = new Mockmongoose();
      const error = new Error('Database failure');
      jest.mocked(mockModel.findOne).mockRejectedValue(error as never);

      const repo = new UserRepository(mockModel as any);

      await expect(repo.findByEmail('error@example.com')).rejects.toThrow('Database failure');
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: 'error@example.com' });
    });

    it('should handle very long email strings', async () => {
      // This test ensures that findByEmail can handle very long email strings.
      const longEmail = 'a'.repeat(256) + '@example.com';
      const mockModel = new Mockmongoose();
      jest.mocked(mockModel.findOne).mockResolvedValue(null as any as never);

      const repo = new UserRepository(mockModel as any);

      const result = await repo.findByEmail(longEmail);
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: longEmail });
      expect(result).toBeNull();
    });
  });
});

import UserRepository from '../UserRepository';


// UserRepository.findByUsername.spec.ts


// UserRepository.findByUsername.spec.ts
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
  public findOne = jest.fn();
}

describe('UserRepository.findByUsername() findByUsername method', () => {
  // Happy Paths
  describe("Happy paths", () => {
    it("should retrieve a user by username when the user exists", async () => {
      // This test aims to verify that findByUsername returns the user when found.
      const mockUser: MockIUser = {
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
        phone: "1234567890",
        isEnabled: true,
        failedLogins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: new MockObjectId(),
      };

      const mockUserModel = new MockUserModel();
      jest.mocked(mockUserModel.findOne).mockResolvedValue(mockUser as any);

      const userRepository = new UserRepository(mockUserModel as any);

      const result = await userRepository.findByUsername("testuser");

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(result).toBe(mockUser);
    });

    it("should retrieve a user by username when the user has minimal fields", async () => {
      // This test aims to verify that findByUsername works with a user having only the username field.
      const mockUser: MockIUser = {
        username: "minimaluser",
      };

      const mockUserModel = new MockUserModel();
      jest.mocked(mockUserModel.findOne).mockResolvedValue(mockUser as any);

      const userRepository = new UserRepository(mockUserModel as any);

      const result = await userRepository.findByUsername("minimaluser");

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: "minimaluser" });
      expect(result).toBe(mockUser);
    });

    it("should call findOne with the correct username", async () => {
      // This test aims to verify that findByUsername passes the correct query to findOne.
      const mockUserModel = new MockUserModel();
      jest.mocked(mockUserModel.findOne).mockResolvedValue({} as any);

      const userRepository = new UserRepository(mockUserModel as any);

      const username = "caseSensitiveUser";
      await userRepository.findByUsername(username);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: username });
    });
  });

  // Edge Cases
  describe("Edge cases", () => {
    it("should return null when no user is found", async () => {
      // This test aims to verify that findByUsername returns null if the user does not exist.
      const mockUserModel = new MockUserModel();
      jest.mocked(mockUserModel.findOne).mockResolvedValue(null as any);

      const userRepository = new UserRepository(mockUserModel as any);

      const result = await userRepository.findByUsername("nonexistentuser");

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: "nonexistentuser" });
      expect(result).toBeNull();
    });

    it("should handle usernames with special characters", async () => {
      // This test aims to verify that findByUsername works with usernames containing special characters.
      const specialUsername = "user!@#$_-";
      const mockUser: MockIUser = {
        username: specialUsername,
      };

      const mockUserModel = new MockUserModel();
      jest.mocked(mockUserModel.findOne).mockResolvedValue(mockUser as any);

      const userRepository = new UserRepository(mockUserModel as any);

      const result = await userRepository.findByUsername(specialUsername);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: specialUsername });
      expect(result).toBe(mockUser);
    });

    it("should handle empty string as username", async () => {
      // This test aims to verify that findByUsername can handle an empty string as username.
      const mockUserModel = new MockUserModel();
      jest.mocked(mockUserModel.findOne).mockResolvedValue(null as any);

      const userRepository = new UserRepository(mockUserModel as any);

      const result = await userRepository.findByUsername("");

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: "" });
      expect(result).toBeNull();
    });

    it("should propagate errors thrown by the userModel.findOne", async () => {
      // This test aims to verify that findByUsername propagates errors from the underlying model.
      const mockUserModel = new MockUserModel();
      const error = new Error("Database failure");
      jest.mocked(mockUserModel.findOne).mockRejectedValue(error as never);

      const userRepository = new UserRepository(mockUserModel as any);

      await expect(userRepository.findByUsername("anyuser")).rejects.toThrow("Database failure");
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: "anyuser" });
    });

    it("should handle usernames with leading and trailing spaces", async () => {
      // This test aims to verify that findByUsername does not trim or alter the username.
      const usernameWithSpaces = "  spaceduser  ";
      const mockUser: MockIUser = {
        username: usernameWithSpaces,
      };

      const mockUserModel = new MockUserModel();
      jest.mocked(mockUserModel.findOne).mockResolvedValue(mockUser as any);

      const userRepository = new UserRepository(mockUserModel as any);

      const result = await userRepository.findByUsername(usernameWithSpaces);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: usernameWithSpaces });
      expect(result).toBe(mockUser);
    });

    it("should handle very long usernames", async () => {
      // This test aims to verify that findByUsername can handle very long usernames.
      const longUsername = "u".repeat(256);
      const mockUser: MockIUser = {
        username: longUsername,
      };

      const mockUserModel = new MockUserModel();
      jest.mocked(mockUserModel.findOne).mockResolvedValue(mockUser as any);

      const userRepository = new UserRepository(mockUserModel as any);

      const result = await userRepository.findByUsername(longUsername);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: longUsername });
      expect(result).toBe(mockUser);
    });
  });
});
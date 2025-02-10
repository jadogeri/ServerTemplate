
// Unit tests for: update


import { IUser } from "../../../src/interfaces/IUser";
import User from "../../../src/models/userModel";
import { update } from '../../../src/services/userService';




// Mocking mongoose and User model
jest.mock("mongoose", () => ({
  Types: {
    ObjectId: jest.fn(),
  },
}));

jest.mock("../../../src/models/userModel", () => ({
  findOneAndUpdate: jest.fn(),
}));

// MockObjectId class to simulate mongoose.Types.ObjectId
class MockObjectId {
  public id: string = 'mockedObjectId';
}

describe('update() update method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should update a user successfully with valid ObjectId and user data', async () => {
      // Arrange
      const mockId = new MockObjectId() as any;
      const mockUser: IUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUpdatedUser = { ...mockUser, _id: mockId.id };
      jest.mocked(User.findOneAndUpdate).mockResolvedValue(mockUpdatedUser as any as never);

      // Act
      const result = await update(mockId as any, mockUser);

      // Assert
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockId },
        { $set: mockUser },
        { upsert: true }
      );
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('Edge cases', () => {
    it('should handle an empty user object gracefully', async () => {
      // Arrange
      const mockId = new MockObjectId() as any;
      const mockUser: IUser = {};

      jest.mocked(User.findOneAndUpdate).mockResolvedValue(null as any as never);

      // Act
      const result = await update(mockId as any, mockUser);

      // Assert
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockId },
        { $set: mockUser },
        { upsert: true }
      );
      expect(result).toBeNull();
    });

    it('should handle a non-existent user gracefully', async () => {
      // Arrange
      const mockId = new MockObjectId() as any;
      const mockUser: IUser = {
        username: 'nonexistentuser',
      };

      jest.mocked(User.findOneAndUpdate).mockResolvedValue(null as any as never);

      // Act
      const result = await update(mockId as any, mockUser);

      // Assert
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockId },
        { $set: mockUser },
        { upsert: true }
      );
      expect(result).toBeNull();
    });

    it('should throw an error if findOneAndUpdate fails', async () => {
      // Arrange
      const mockId = new MockObjectId() as any;
      const mockUser: IUser = {
        username: 'erroruser',
      };

      jest.mocked(User.findOneAndUpdate).mockRejectedValue(new Error('Database error') as never);

      // Act & Assert
      await expect(update(mockId as any, mockUser)).rejects.toThrow('Database error');
    });
  });
});

// End of unit tests for: update

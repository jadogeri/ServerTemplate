
// Unit tests for: remove


import User from "../../../src/models/userModel";
import { remove } from '../../../src/services/userService';


// Import necessary modules and dependencies


// Import necessary modules and dependencies
// Mock the mongoose module
jest.mock("mongoose", () => ({
  Types: {
    ObjectId: jest.fn(),
  },
}));

// Mock the User model
jest.mock("../../../src/models/userModel", () => ({
  findByIdAndDelete: jest.fn(),
}));

// Create a MockObjectId class to simulate mongoose.Types.ObjectId
class MockObjectId {
  public id: string = 'mockedObjectId';
}

// Test suite for the remove function
describe('remove() remove method', () => {
  // Happy path tests
  describe('Happy Paths', () => {
    it('should successfully remove a user by ObjectId', async () => {
      // Arrange
      const mockId = new MockObjectId() as any;
      const mockUser = { _id: mockId, username: 'testuser' } as any;
      jest.mocked(User.findByIdAndDelete).mockResolvedValue(mockUser as any as never);

      // Act
      const result = await remove(mockId);

      // Assert
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockUser);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should return null if no user is found with the given ObjectId', async () => {
      // Arrange
      const mockId = new MockObjectId() as any;
      jest.mocked(User.findByIdAndDelete).mockResolvedValue(null as any as never);

      // Act
      const result = await remove(mockId);

      // Assert
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result).toBeNull();
    });

    it('should handle errors thrown by the database operation', async () => {
      // Arrange
      const mockId = new MockObjectId() as any;
      const error = new Error('Database error');
      jest.mocked(User.findByIdAndDelete).mockRejectedValue(error as never);

      // Act & Assert
      await expect(remove(mockId)).rejects.toThrow('Database error');
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockId);
    });
  });
});

// End of unit tests for: remove


// Unit tests for: remove


import User from "../../../src/models/userModel";
import { remove } from '../../../src/services/userService';


// Import necessary modules and dependencies


// Import necessary modules and dependencies
// Mock the mongoose ObjectId
class MockObjectId {
  public id: string = '507f1f77bcf86cd799439011';
}

// Mock the User model's findByIdAndDelete method
jest.mock("../../../src/models/userModel", () => ({
  findByIdAndDelete: jest.fn(),
}));

describe('remove() remove method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should successfully delete a user by id', async () => {
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

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return null if user id does not exist', async () => {
      // Arrange
      const mockId = new MockObjectId() as any;
      jest.mocked(User.findByIdAndDelete).mockResolvedValue(null as any as never);

      // Act
      const result = await remove(mockId);

      // Assert
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result).toBeNull();
    });

    it('should handle errors thrown by the database', async () => {
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

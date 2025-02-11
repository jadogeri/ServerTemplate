
// Unit tests for: getById


import { IAuth } from "../../../src/interfaces/IAuth";
import Auth from "../../../src/models/authModel";
import { getById } from '../../../src/services/authService';


// Import necessary modules and dependencies


// Import necessary modules and dependencies
// Mock the mongoose.Types.ObjectId
class MockObjectId {
  public id: string = '507f1f77bcf86cd799439011';
}

// Mock the Auth model's findOne method
jest.mock("../../../src/models/authModel", () => ({
  findOne: jest.fn(),
}));

describe('getById() getById method', () => {
  // Happy path tests
  describe('Happy paths', () => {
  });

  // Edge case tests
  describe('Edge cases', () => {
    it('should return null when no auth object is found for the given ID', async () => {
      // Arrange
      const mockId = new MockObjectId() as any;
      jest.mocked(Auth.findOne).mockResolvedValue(null as any as never);

      // Act
      const result = await getById(mockId as any);

      // Assert
      expect(result).toBeNull();
      expect(Auth.findOne).toHaveBeenCalledWith({ id: mockId });
    });

    it('should handle errors thrown by the database query', async () => {
      // Arrange
      const mockId = new MockObjectId() as any;
      const error = new Error('Database error');
      jest.mocked(Auth.findOne).mockRejectedValue(error as never);

      // Act & Assert
      await expect(getById(mockId as any)).rejects.toThrow('Database error');
      expect(Auth.findOne).toHaveBeenCalledWith({ id: mockId });
    });
  });
});

// End of unit tests for: getById

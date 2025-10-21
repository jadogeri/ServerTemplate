
// Unit tests for: connectMongoDB


import mongoose from "mongoose";
import { connectMongoDB } from '../../../src/configs/mongoDB';


jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe('connectMongoDB() connectMongoDB method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Paths', () => {
    it('should connect to the database successfully with a valid URL', async () => {
      // Arrange
      const mockMongoURL = 'mongodb://localhost:27017/testdb';
      const mockConnection = {
        connection: {
          host: 'localhost',
          name: 'testdb',
        },
      };
      (mongoose.connect as jest.Mock).mockResolvedValue(mockConnection);

      // Act
      await connectMongoDB(mockMongoURL);

      // Assert
      expect(mongoose.connect).toHaveBeenCalledWith(mockMongoURL);
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle connection errors gracefully', async () => {
      // Arrange
      const mockMongoURL = 'mongodb://invalid-url';
      const mockError = new Error('Connection failed');
      (mongoose.connect as jest.Mock).mockRejectedValue(mockError);

      // Act
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      // Assert
      await expect(connectMongoDB(mockMongoURL)).rejects.toThrow('process.exit called');
      expect(mongoose.connect).toHaveBeenCalledWith(mockMongoURL);
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
    });
  });
});

// End of unit tests for: connectMongoDB

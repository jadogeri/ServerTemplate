
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
    it('should connect to the database successfully with a valid mongoURL', async () => {
      // Arrange: Mock mongoose.connect to resolve successfully
      const mockConnection = {
        connection: {
          host: 'localhost',
          name: 'testDB',
        },
      };
      (mongoose.connect as jest.Mock).mockResolvedValue(mockConnection);

      // Act: Call the connectMongoDB function
      await connectMongoDB('mongodb://valid-url');

      // Assert: Ensure mongoose.connect was called with the correct URL
      expect(mongoose.connect).toHaveBeenCalledWith('mongodb://valid-url');
      // Assert: Ensure console.log was called with the correct connection details
      expect(console.log).toHaveBeenCalledWith(
        'Database connected: ',
        'localhost',
        'testDB'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle connection errors gracefully', async () => {
      // Arrange: Mock mongoose.connect to reject with an error
      const mockError = new Error('Connection failed');
      (mongoose.connect as jest.Mock).mockRejectedValue(mockError);

      // Spy on process.exit to prevent the test from exiting
      const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit was called');
      });

      // Act & Assert: Call the connectMongoDB function and expect process.exit to be called
      await expect(connectMongoDB('mongodb://invalid-url')).rejects.toThrow(
        'process.exit was called'
      );

      // Assert: Ensure mongoose.connect was called with the correct URL
      expect(mongoose.connect).toHaveBeenCalledWith('mongodb://invalid-url');
      // Assert: Ensure console.log was called with the error
      expect(console.log).toHaveBeenCalledWith(mockError);

      // Restore the original process.exit implementation
      processExitSpy.mockRestore();
    });
  });
});

// End of unit tests for: connectMongoDB

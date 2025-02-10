
// Unit tests for: getInstance


import { connectMongoDB } from '../../../src/configs/mongoDB';
import MongoDatabase from '../../../src/entities/MongoDatabase';




jest.mock("dotenv");
jest.mock("../../../src/configs/mongoDB");

describe('MongoDatabase.getInstance() getInstance method', () => {
  beforeEach(() => {
    // Reset the singleton instance before each test
    (MongoDatabase as any)._database = null;
    jest.clearAllMocks();
  });

  describe('Happy Paths', () => {
    it('should create a new instance when none exists', () => {
      // Arrange
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';

      // Act
      const instance = MongoDatabase.getInstance();

      // Assert
      expect(instance).toBeInstanceOf(MongoDatabase);
      expect(connectMongoDB).toHaveBeenCalledWith('mongodb://localhost:27017/testdb');
    });

    it('should return the existing instance if one already exists', () => {
      // Arrange
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      const firstInstance = MongoDatabase.getInstance();

      // Act
      const secondInstance = MongoDatabase.getInstance();

      // Assert
      expect(secondInstance).toBe(firstInstance);
      expect(connectMongoDB).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should not create a new instance if MONGODB_URI is an empty string', () => {
      // Arrange
      process.env.MONGODB_URI = '';

      // Act
      const instance = MongoDatabase.getInstance();

      // Assert
      expect(instance).toBeInstanceOf(MongoDatabase);
      expect(connectMongoDB).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: getInstance

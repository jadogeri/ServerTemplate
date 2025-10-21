
// Unit tests for: getInstance


import { connectMongoDB } from '../../../src/configs/mongoDB';
import MongoDatabase from '../../../src/entities/MongoDatabase';




jest.mock("dotenv");
jest.mock("../../../src/configs/mongoDB", () => ({
  connectMongoDB: jest.fn(),
}));

describe('MongoDatabase.getInstance() getInstance method', () => {
  beforeEach(() => {
    // Reset the singleton instance before each test
    (MongoDatabase as any)._database = null;
    jest.clearAllMocks();
  });

  describe('Happy Paths', () => {
    it('should create a new instance when none exists', () => {
      // Test that a new instance is created when none exists
      const instance = MongoDatabase.getInstance();
      expect(instance).toBeInstanceOf(MongoDatabase);
    });

    it('should return the same instance when one already exists', () => {
      // Test that the same instance is returned when one already exists
      const firstInstance = MongoDatabase.getInstance();
      const secondInstance = MongoDatabase.getInstance();
      expect(firstInstance).toBe(secondInstance);
    });

    it('should call connectMongoDB with the correct URL from environment variables', () => {
      // Test that connectMongoDB is called with the correct URL
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      MongoDatabase.getInstance();
      expect(connectMongoDB).toHaveBeenCalledWith('mongodb://localhost:27017/testdb');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple calls to getInstance gracefully', () => {
      // Test that multiple calls to getInstance do not create multiple instances
      const instances = Array.from({ length: 5 }, () => MongoDatabase.getInstance());
      const uniqueInstances = new Set(instances);
      expect(uniqueInstances.size).toBe(1);
    });
  });
});

// End of unit tests for: getInstance

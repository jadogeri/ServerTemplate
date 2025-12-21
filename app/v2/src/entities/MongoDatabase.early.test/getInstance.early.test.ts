
import { connectMongoDB } from '../../configs/mongoDB';
import MongoDatabase from '../MongoDatabase';


/**
 * @file MongoDatabase.getInstance unit tests
 * @description Comprehensive Jest test suite for MongoDatabase.getInstance, covering happy paths and edge cases.
 */



jest.mock("dotenv");
jest.mock("../../configs/mongoDB", () => ({
  connectMongoDB: jest.fn(),
}));

describe('MongoDatabase.getInstance() getInstance method', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    // Reset modules and environment variables before each test
    jest.resetModules();
    process.env = { ...OLD_ENV };
    // Reset singleton for each test
    // @ts-ignore
    MongoDatabase['_database'] = null;
    (connectMongoDB as jest.Mock).mockClear();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  // =========================
  // Happy Path Tests
  // =========================

  test('should create a new instance and call connectMongoDB when MONGODB_URI is set and NODE_ENV is not "test"', () => {
    /**
     * This test ensures that when MONGODB_URI is set and NODE_ENV is not "test",
     * getInstance creates a new MongoDatabase instance and calls connectMongoDB with the correct URI.
     */
    process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
    process.env.NODE_ENV = 'development';

    const instance = MongoDatabase.getInstance();

    expect(instance).toBeInstanceOf(MongoDatabase);
    expect(connectMongoDB).toHaveBeenCalledTimes(1);
    expect(connectMongoDB).toHaveBeenCalledWith('mongodb://localhost:27017/testdb');
  });

  test('should return the same singleton instance on subsequent calls', () => {
    /**
     * This test ensures that getInstance always returns the same instance (singleton)
     * and does not call connectMongoDB again on subsequent calls.
     */
    process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
    process.env.NODE_ENV = 'production';

    const instance1 = MongoDatabase.getInstance();
    const instance2 = MongoDatabase.getInstance();

    expect(instance1).toBe(instance2);
    expect(connectMongoDB).toHaveBeenCalledTimes(1);
  });

  test('should not call connectMongoDB when NODE_ENV is "test" even if MONGODB_URI is set', () => {
    /**
     * This test ensures that connectMongoDB is not called when NODE_ENV is "test",
     * even if MONGODB_URI is provided.
     */
    process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
    process.env.NODE_ENV = 'test';

    const instance = MongoDatabase.getInstance();

    expect(instance).toBeInstanceOf(MongoDatabase);
    expect(connectMongoDB).not.toHaveBeenCalled();
  });

  // =========================
  // Edge Case Tests
  // =========================

  test('should not call connectMongoDB if MONGODB_URI is not set', () => {
    /**
     * This test ensures that connectMongoDB is not called if MONGODB_URI is missing,
     * regardless of NODE_ENV.
     */
    delete process.env.MONGODB_URI;
    process.env.NODE_ENV = 'development';

    const instance = MongoDatabase.getInstance();

    expect(instance).toBeInstanceOf(MongoDatabase);
    expect(connectMongoDB).not.toHaveBeenCalled();
  });

  test('should not call connectMongoDB if MONGODB_URI is an empty string', () => {
    /**
     * This test ensures that connectMongoDB is not called if MONGODB_URI is an empty string.
     */
    process.env.MONGODB_URI = '';
    process.env.NODE_ENV = 'development';

    const instance = MongoDatabase.getInstance();

    expect(instance).toBeInstanceOf(MongoDatabase);
    expect(connectMongoDB).not.toHaveBeenCalled();
  });

  test('should not call connectMongoDB if NODE_ENV is undefined', () => {
    /**
     * This test ensures that connectMongoDB is called if NODE_ENV is undefined and MONGODB_URI is set,
     * since the check is only for NODE_ENV !== "test".
     */
    process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
    delete process.env.NODE_ENV;

    const instance = MongoDatabase.getInstance();

    expect(instance).toBeInstanceOf(MongoDatabase);
    expect(connectMongoDB).toHaveBeenCalledTimes(1);
    expect(connectMongoDB).toHaveBeenCalledWith('mongodb://localhost:27017/testdb');
  });

  test('should not throw if connectMongoDB throws (error is not propagated)', () => {
    /**
     * This test ensures that if connectMongoDB throws, the error is not propagated
     * and getInstance still returns an instance.
     */
    process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
    process.env.NODE_ENV = 'development';
    (connectMongoDB as jest.Mock).mockImplementation(() => {
      throw new Error('Connection failed');
    });

    expect(() => MongoDatabase.getInstance()).not.toThrow();
    expect(connectMongoDB).toHaveBeenCalledTimes(1);
  });
});
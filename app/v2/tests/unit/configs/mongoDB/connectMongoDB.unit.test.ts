
import mongoose from "mongoose";
import { connectMongoDB } from '../../../../src/configs/mongoDB';


// app/v2/src/configs/mongoDB.test.ts


// app/v2/src/configs/mongoDB.test.ts
// Mock class for mongoose and its nested properties
class MockConnection {
  public host: string = "mockHost";
  public name: string = "mockDB";
}

class MockMongoose {
  public connect = jest.fn();
  public connection: MockConnection = new MockConnection();
}

// Save original process.exit to restore after tests

describe('connectMongoDB() connectMongoDB method', () => {
  let mockMongoose: MockMongoose;
  let originalMongooseConnect: any;
  let originalMongooseConnection: any;
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a new mock for each test
    mockMongoose = new MockMongoose();

    // Save original mongoose.connect and mongoose.connection
    originalMongooseConnect = (mongoose as any).connect;
    originalMongooseConnection = (mongoose as any).connection;

    // Replace mongoose.connect and mongoose.connection with mocks
    (mongoose as any).connect = jest.mocked(mockMongoose.connect);
    (mongoose as any).connection = mockMongoose.connection as any;

    // Spy on process.exit
    processExitSpy = jest.spyOn(process, "exit").mockImplementation(((code?: number) => {
      throw new Error(`process.exit: ${code}`);
    }) as any);
  });

  afterEach(() => {
    // Restore original mongoose.connect and mongoose.connection
    (mongoose as any).connect = originalMongooseConnect;
    (mongoose as any).connection = originalMongooseConnection;

    // Restore process.exit
    processExitSpy.mockRestore();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should connect successfully with a valid mongoURL", async () => {
      // This test ensures connectMongoDB resolves when mongoose.connect succeeds.
      (mockMongoose.connect as any).mockResolvedValue({
        connection: {
          host: "mockHost",
          name: "mockDB"
        }
      } as any);

      const mongoURL = "mongodb://localhost:27017/testdb";
      await expect(connectMongoDB(mongoURL)).resolves.toBeUndefined();
      expect(jest.mocked(mockMongoose.connect)).toHaveBeenCalledWith(mongoURL);
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    it("should connect successfully with a different valid mongoURL", async () => {
      // This test ensures connectMongoDB works with another valid URL.
      (mockMongoose.connect as any).mockResolvedValue({
        connection: {
          host: "anotherHost",
          name: "anotherDB"
        }
      } as any);

      const mongoURL = "mongodb://127.0.0.1:27018/anotherdb";
      await expect(connectMongoDB(mongoURL)).resolves.toBeUndefined();
      expect(jest.mocked(mockMongoose.connect)).toHaveBeenCalledWith(mongoURL);
      expect(processExitSpy).not.toHaveBeenCalled();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should call process.exit(1) if mongoose.connect throws an error", async () => {
      // This test ensures connectMongoDB handles connection errors by calling process.exit(1).
      (mockMongoose.connect as any).mockRejectedValue(new Error("Connection failed"));

      const mongoURL = "mongodb://localhost:27017/faildb";
      await expect(connectMongoDB(mongoURL)).rejects.toThrow("process.exit: 1");
      expect(jest.mocked(mockMongoose.connect)).toHaveBeenCalledWith(mongoURL);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle an empty string as mongoURL and call process.exit(1) on failure", async () => {
      // This test ensures connectMongoDB handles empty mongoURL and fails gracefully.
      (mockMongoose.connect as any).mockRejectedValue(new Error("Empty URL"));

      const mongoURL = "";
      await expect(connectMongoDB(mongoURL)).rejects.toThrow("process.exit: 1");
      expect(jest.mocked(mockMongoose.connect)).toHaveBeenCalledWith(mongoURL);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle a malformed mongoURL and call process.exit(1) on failure", async () => {
      // This test ensures connectMongoDB handles malformed mongoURL and fails gracefully.
      (mockMongoose.connect as any).mockRejectedValue(new Error("Malformed URL"));

      const mongoURL = "not-a-valid-mongo-url";
      await expect(connectMongoDB(mongoURL)).rejects.toThrow("process.exit: 1");
      expect(jest.mocked(mockMongoose.connect)).toHaveBeenCalledWith(mongoURL);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle a mongoURL with special characters and connect successfully", async () => {
      // This test ensures connectMongoDB works with special characters in the URL.
      (mockMongoose.connect as any).mockResolvedValue({
        connection: {
          host: "specialHost",
          name: "specialDB"
        }
      } as any);

      const mongoURL = "mongodb://user:pass!@localhost:27017/special_db";
      await expect(connectMongoDB(mongoURL)).resolves.toBeUndefined();
      expect(jest.mocked(mockMongoose.connect)).toHaveBeenCalledWith(mongoURL);
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    it("should handle when mongoose.connect resolves with unexpected structure", async () => {
      // This test ensures connectMongoDB does not throw if mongoose.connect returns an unexpected object.
      (mockMongoose.connect as any).mockResolvedValue({} as any);

      const mongoURL = "mongodb://localhost:27017/strange";
      await expect(connectMongoDB(mongoURL)).resolves.toBeUndefined();
      expect(jest.mocked(mockMongoose.connect)).toHaveBeenCalledWith(mongoURL);
      expect(processExitSpy).not.toHaveBeenCalled();
    });
  });
});
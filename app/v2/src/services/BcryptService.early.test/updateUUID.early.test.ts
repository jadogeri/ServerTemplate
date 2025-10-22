
import { generateRandomUUID } from "../../utils/generateRandonUUID";
import BcryptService from '../BcryptService';


// app/v2/src/services/BcryptService.updateUUID.spec.ts
// Mock generateRandomUUID, preserving all other exports
jest.mock("../../utils/generateRandonUUID", () => {
  const actual = jest.requireActual("../../utils/generateRandonUUID");
  return {
    ...actual,
    generateRandomUUID: jest.fn(),
    __esModule: true,
  };
});

const mockedGenerateRandomUUID = jest.mocked(generateRandomUUID);

describe('BcryptService.updateUUID() updateUUID method', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV }; // Reset env before each test
    mockedGenerateRandomUUID.mockReset();
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore original env
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    test('should set uuid to the value returned by generateRandomUUID with correct size', () => {
      // This test ensures updateUUID sets uuid using generateRandomUUID with the correct size from env
      process.env.NANOID_SIZE = '12';
      const expectedUUID = 'abc123def456';
      mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

      const service = new BcryptService();
      service.updateUUID();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledTimes(1);
      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(12);
      // @ts-ignore: Accessing private property for test
      expect((service as any).uuid).toBe(expectedUUID);
    });

    test('should update uuid each time updateUUID is called', () => {
      // This test ensures that calling updateUUID multiple times updates the uuid each time
      process.env.NANOID_SIZE = '8';
      const firstUUID = 'first123';
      const secondUUID = 'second12';
      mockedGenerateRandomUUID
        .mockReturnValueOnce(firstUUID)
        .mockReturnValueOnce(secondUUID);

      const service = new BcryptService();
      service.updateUUID();
      // @ts-ignore: Accessing private property for test
      expect((service as any).uuid).toBe(firstUUID);

      service.updateUUID();
      // @ts-ignore: Accessing private property for test
      expect((service as any).uuid).toBe(secondUUID);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle NANOID_SIZE as a string with leading/trailing spaces', () => {
      // This test ensures that NANOID_SIZE with spaces is parsed correctly
      process.env.NANOID_SIZE = ' 10 ';
      const expectedUUID = 'abcdefghij';
      mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

      const service = new BcryptService();
      service.updateUUID();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(10);
      // @ts-ignore: Accessing private property for test
      expect((service as any).uuid).toBe(expectedUUID);
    });

    test('should handle NANOID_SIZE as a string with leading zeros', () => {
      // This test ensures that NANOID_SIZE with leading zeros is parsed correctly
      process.env.NANOID_SIZE = '007';
      const expectedUUID = 'abcdefg';
      mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

      const service = new BcryptService();
      service.updateUUID();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(7);
      // @ts-ignore: Accessing private property for test
      expect((service as any).uuid).toBe(expectedUUID);
    });

    test('should set uuid to empty string if generateRandomUUID returns empty string', () => {
      // This test ensures that if generateRandomUUID returns an empty string, uuid is set to empty string
      process.env.NANOID_SIZE = '5';
      mockedGenerateRandomUUID.mockReturnValueOnce('');

      const service = new BcryptService();
      service.updateUUID();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(5);
      // @ts-ignore: Accessing private property for test
      expect((service as any).uuid).toBe('');
    });

    test('should throw if NANOID_SIZE is not a number', () => {
      // This test ensures that if NANOID_SIZE is not a number, updateUUID throws
      process.env.NANOID_SIZE = 'notanumber';

      // The constructor will try to parseInt('notanumber') => NaN
      // generateRandomUUID will be called with NaN
      mockedGenerateRandomUUID.mockImplementationOnce((size: number) => {
        if (isNaN(size)) throw new Error('Invalid size');
        return 'shouldNotReach';
      });

      const service = new BcryptService();
      expect(() => service.updateUUID()).toThrow('Invalid size');
    });

    test('should handle NANOID_SIZE as zero', () => {
      // This test ensures that if NANOID_SIZE is '0', generateRandomUUID is called with 0
      process.env.NANOID_SIZE = '0';
      mockedGenerateRandomUUID.mockReturnValueOnce('');

      const service = new BcryptService();
      service.updateUUID();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(0);
      // @ts-ignore: Accessing private property for test
      expect((service as any).uuid).toBe('');
    });

    test('should handle NANOID_SIZE as a negative number', () => {
      // This test ensures that if NANOID_SIZE is negative, generateRandomUUID is called with negative number
      process.env.NANOID_SIZE = '-5';
      mockedGenerateRandomUUID.mockReturnValueOnce('neg');

      const service = new BcryptService();
      service.updateUUID();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(-5);
      // @ts-ignore: Accessing private property for test
      expect((service as any).uuid).toBe('neg');
    });

    test('should propagate error if generateRandomUUID throws', () => {
      // This test ensures that if generateRandomUUID throws, the error is propagated
      process.env.NANOID_SIZE = '6';
      mockedGenerateRandomUUID.mockImplementationOnce(() => {
        throw new Error('Random UUID generation failed');
      });

      const service = new BcryptService();
      expect(() => service.updateUUID()).toThrow('Random UUID generation failed');
    });
  });
});
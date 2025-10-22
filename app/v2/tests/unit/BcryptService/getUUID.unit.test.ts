
import { generateRandomUUID } from "../../../src/utils/generateRandonUUID";
import BcryptService from '../../../src/services/BcryptService';


// BcryptService.getUUID.spec.ts
// Mock generateRandomUUID, preserving all other exports
jest.mock("../../../src/utils/generateRandonUUID", () => {
  const actual = jest.requireActual("../../../src/utils/generateRandonUUID");
  return {
    ...actual,
    generateRandomUUID: jest.fn(),
    __esModule: true,
  };
});

describe('BcryptService.getUUID() getUUID method', () => {
  const mockedGenerateRandomUUID = jest.mocked(generateRandomUUID);

  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
    // Set a default NANOID_SIZE for all tests unless overridden
    process.env.NANOID_SIZE = '21';
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  // =========================
  // Happy Path Tests
  // =========================

  it('should generate and return a new UUID when called for the first time (uuid is initially null)', () => {
    // This test ensures that getUUID generates a new UUID if none exists.
    const expectedUUID = 'abc123xyz';
    mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

    const service = new BcryptService();

    // At this point, uuid is null
    const result = service.getUUID();

    expect(mockedGenerateRandomUUID).toHaveBeenCalledTimes(1);
    expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(21); // default NANOID_SIZE
    expect(result).toBe(expectedUUID);
  });

  it('should return the same UUID on subsequent calls without regenerating', () => {
    // This test ensures that getUUID does not regenerate the UUID if it already exists.
    const expectedUUID = 'persisted-uuid';
    mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

    const service = new BcryptService();

    // First call generates the UUID
    const first = service.getUUID();
    // Second call should not call generateRandomUUID again
    const second = service.getUUID();

    expect(first).toBe(expectedUUID);
    expect(second).toBe(expectedUUID);
    expect(mockedGenerateRandomUUID).toHaveBeenCalledTimes(1);
  });

  it('should use the NANOID_SIZE from process.env when generating the UUID', () => {
    // This test ensures that the size from process.env is used.
    process.env.NANOID_SIZE = '42';
    const expectedUUID = 'size-42-uuid';
    mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

    const service = new BcryptService();
    const result = service.getUUID();

    expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(42);
    expect(result).toBe(expectedUUID);
  });

  // =========================
  // Edge Case Tests
  // =========================

  it('should handle NANOID_SIZE as a string that is not a number gracefully (NaN)', () => {
    // This test checks behavior when NANOID_SIZE is not a valid number.
    process.env.NANOID_SIZE = 'not-a-number';
    // parseInt('not-a-number') === NaN
    const expectedUUID = 'nan-uuid';
    mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

    const service = new BcryptService();
    const result = service.getUUID();

    // The service will call generateRandomUUID(NaN)
    expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(NaN);
    expect(result).toBe(expectedUUID);
  });

  it('should handle NANOID_SIZE as zero', () => {
    // This test checks behavior when NANOID_SIZE is '0'
    process.env.NANOID_SIZE = '0';
    const expectedUUID = '';
    mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

    const service = new BcryptService();
    const result = service.getUUID();

    expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(0);
    expect(result).toBe(expectedUUID);
  });

  it('should handle NANOID_SIZE as a negative number', () => {
    // This test checks behavior when NANOID_SIZE is negative
    process.env.NANOID_SIZE = '-5';
    const expectedUUID = 'neg-uuid';
    mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

    const service = new BcryptService();
    const result = service.getUUID();

    expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(-5);
    expect(result).toBe(expectedUUID);
  });

  it('should handle NANOID_SIZE as a very large number', () => {
    // This test checks behavior when NANOID_SIZE is very large
    process.env.NANOID_SIZE = '10000';
    const expectedUUID = 'large-uuid';
    mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

    const service = new BcryptService();
    const result = service.getUUID();

    expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(10000);
    expect(result).toBe(expectedUUID);
  });

  it('should throw if generateRandomUUID throws an error', () => {
    // This test ensures that errors from generateRandomUUID are propagated.
    mockedGenerateRandomUUID.mockImplementationOnce(() => {
      throw new Error('UUID generation failed');
    });

    const service = new BcryptService();

    expect(() => service.getUUID()).toThrow('UUID generation failed');
    expect(mockedGenerateRandomUUID).toHaveBeenCalledTimes(1);
  });

  it('should return the correct UUID even if it is an empty string', () => {
    // This test checks that an empty string UUID is handled as a valid value.
    const expectedUUID = '';
    mockedGenerateRandomUUID.mockReturnValueOnce(expectedUUID);

    const service = new BcryptService();
    const result = service.getUUID();

    expect(result).toBe(expectedUUID);

    // On subsequent call, should not call generateRandomUUID again
    const result2 = service.getUUID();
    expect(result2).toBe(expectedUUID);
    expect(mockedGenerateRandomUUID).toHaveBeenCalledTimes(1);
  });
});
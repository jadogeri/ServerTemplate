
import * as bcrypt from "bcrypt";
import { generateRandomUUID } from "../../utils/generateRandonUUID";
import BcryptService from '../BcryptService';


// BcryptService.getHashedPassword.spec.ts


// BcryptService.getHashedPassword.spec.ts
// Mock generateRandomUUID, only the named export, all other exports are actual
jest.mock("../../utils/generateRandonUUID", () => {
  const actual = jest.requireActual("../../utils/generateRandonUUID");
  return {
    ...actual,
    generateRandomUUID: jest.fn(),
  };
});

// Mock bcrypt, only the hash function, all other exports are actual
jest.mock("bcrypt", () => {
  const actual = jest.requireActual("bcrypt");
  return {
    ...actual,
    hash: jest.fn(),
    __esModule: true,
  };
});

const mockedGenerateRandomUUID = jest.mocked(generateRandomUUID);
const mockedBcryptHash = jest.mocked(bcrypt.hash);

describe('BcryptService.getHashedPassword() getHashedPassword method', () => {
  let originalNanoidSize: string | undefined;
  let originalBcryptSaltRounds: string | undefined;

  beforeAll(() => {
    // Save original env vars
    originalNanoidSize = process.env.NANOID_SIZE;
    originalBcryptSaltRounds = process.env.BCRYPT_SALT_ROUNDS;
  });

  afterAll(() => {
    // Restore original env vars
    process.env.NANOID_SIZE = originalNanoidSize;
    process.env.BCRYPT_SALT_ROUNDS = originalBcryptSaltRounds;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Set default env vars for happy path
    process.env.NANOID_SIZE = '12';
    process.env.BCRYPT_SALT_ROUNDS = '10';
  });

  // Happy Path Tests
  describe('Happy paths', () => {
    it('should generate a UUID, hash it, and return the hashed password', async () => {
      // This test ensures that getHashedPassword returns a hashed password string when all dependencies work as expected.
      const uuid = 'test-uuid-123';
      const hashed = 'hashed-password-abc';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();

      const result = await service.getHashedPassword();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(12);
      expect(mockedBcryptHash).toHaveBeenCalledWith(uuid, 10);
      expect(result).toBe(hashed);
    });

    it('should call updateUUID and getUUID in correct sequence', async () => {
      // This test ensures that updateUUID is called before getUUID, and getUUID returns the correct UUID.
      const uuid = 'sequence-uuid';
      const hashed = 'sequence-hash';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();

      const spyUpdateUUID = jest.spyOn(service, 'updateUUID');
      const spyGetUUID = jest.spyOn(service, 'getUUID');

      const result = await service.getHashedPassword();

      expect(spyUpdateUUID).toHaveBeenCalledTimes(1);
      expect(spyGetUUID).toHaveBeenCalledTimes(1);
      expect(result).toBe(hashed);
    });

    it('should use environment variables for size and salt rounds', async () => {
      // This test ensures that the method uses the correct environment variables for UUID size and bcrypt salt rounds.
      process.env.NANOID_SIZE = '20';
      process.env.BCRYPT_SALT_ROUNDS = '15';

      const uuid = 'env-uuid';
      const hashed = 'env-hash';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();

      const result = await service.getHashedPassword();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(20);
      expect(mockedBcryptHash).toHaveBeenCalledWith(uuid, 15);
      expect(result).toBe(hashed);
    });
  });

  // Edge Case Tests
  describe('Edge cases', () => {
    it('should throw an error if generateRandomUUID throws', async () => {
      // This test ensures that if generateRandomUUID throws, getHashedPassword propagates the error.
      mockedGenerateRandomUUID.mockImplementationOnce(() => {
        throw new Error('UUID generation failed');
      });

      const service = new BcryptService();

      await expect(service.getHashedPassword()).rejects.toThrow('UUID generation failed');
      expect(mockedGenerateRandomUUID).toHaveBeenCalled();
      expect(mockedBcryptHash).not.toHaveBeenCalled();
    });

    it('should throw an error if bcrypt.hash throws', async () => {
      // This test ensures that if bcrypt.hash throws, getHashedPassword propagates the error.
      const uuid = 'error-uuid';
      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockImplementationOnce(() => {
        throw new Error('Bcrypt error');
      });

      const service = new BcryptService();

      await expect(service.getHashedPassword()).rejects.toThrow('Bcrypt error');
      expect(mockedGenerateRandomUUID).toHaveBeenCalled();
      expect(mockedBcryptHash).toHaveBeenCalledWith(uuid, 10);
    });

    it('should throw an error if BCRYPT_SALT_ROUNDS is not a number', async () => {
      // This test ensures that if BCRYPT_SALT_ROUNDS is not a valid number, getHashedPassword throws an error.
      process.env.BCRYPT_SALT_ROUNDS = 'not-a-number';
      const uuid = 'salt-uuid';
      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);

      // bcrypt.hash will be called with NaN, which will likely throw
      mockedBcryptHash.mockImplementationOnce(() => {
        throw new Error('Invalid salt rounds');
      });

      const service = new BcryptService();

      await expect(service.getHashedPassword()).rejects.toThrow('Invalid salt rounds');
      expect(mockedGenerateRandomUUID).toHaveBeenCalled();
      expect(mockedBcryptHash).toHaveBeenCalledWith(uuid, NaN);
    });

    it('should throw an error if NANOID_SIZE is not a number', async () => {
      // This test ensures that if NANOID_SIZE is not a valid number, generateRandomUUID is called with NaN.
      process.env.NANOID_SIZE = 'not-a-number';

      mockedGenerateRandomUUID.mockImplementationOnce((size: number) => {
        if (isNaN(size)) {
          throw new Error('Invalid nanoid size');
        }
        return 'should-not-reach';
      });

      const service = new BcryptService();

      await expect(service.getHashedPassword()).rejects.toThrow('Invalid nanoid size');
      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(NaN);
      expect(mockedBcryptHash).not.toHaveBeenCalled();
    });

    it('should handle very large NANOID_SIZE values', async () => {
      // This test ensures that the method can handle very large NANOID_SIZE values.
      process.env.NANOID_SIZE = '1000';
      const uuid = 'x'.repeat(1000);
      const hashed = 'large-hash';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();

      const result = await service.getHashedPassword();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(1000);
      expect(mockedBcryptHash).toHaveBeenCalledWith(uuid, 10);
      expect(result).toBe(hashed);
    });

    it('should handle minimum NANOID_SIZE value of 1', async () => {
      // This test ensures that the method works with the smallest possible NANOID_SIZE value.
      process.env.NANOID_SIZE = '1';
      const uuid = 'a';
      const hashed = 'min-hash';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();

      const result = await service.getHashedPassword();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(1);
      expect(mockedBcryptHash).toHaveBeenCalledWith(uuid, 10);
      expect(result).toBe(hashed);
    });
  });
});
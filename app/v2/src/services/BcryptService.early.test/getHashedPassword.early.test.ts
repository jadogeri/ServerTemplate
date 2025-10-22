
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
    // Set up default env vars for happy path
    process.env.NANOID_SIZE = '12';
    process.env.BCRYPT_SALT_ROUNDS = '10';
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy paths', () => {
    it('should generate a UUID, hash it, and return the hashed password', async () => {
      // This test aims to verify that getHashedPassword generates a UUID, hashes it, and returns the hash.
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

    it('should update the internal uuid and use it for hashing', async () => {
      // This test aims to verify that the internal uuid is updated and used for hashing.
      const uuid = 'another-uuid-456';
      const hashed = 'another-hash-xyz';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();
      await service.getHashedPassword();

      expect(service.getUUID()).toBe(uuid);
    });

    it('should call generateRandomUUID and bcrypt.hash with correct types', async () => {
      // This test aims to verify that the correct types are passed to generateRandomUUID and bcrypt.hash.
      const uuid = 'typed-uuid-789';
      const hashed = 'typed-hash-789';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();
      await service.getHashedPassword();

      expect(typeof mockedGenerateRandomUUID.mock.calls[0][0]).toBe('number');
      expect(typeof mockedBcryptHash.mock.calls[0][0]).toBe('string');
      expect(typeof mockedBcryptHash.mock.calls[0][1]).toBe('number');
    });
  });

  // Edge Case Tests
  describe('Edge cases', () => {
    it('should handle NANOID_SIZE as a string number and pass correct value to generateRandomUUID', async () => {
      // This test aims to verify that NANOID_SIZE as a string is parsed and used correctly.
      process.env.NANOID_SIZE = '20';
      const uuid = 'edge-uuid-20';
      const hashed = 'edge-hash-20';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();
      await service.getHashedPassword();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(20);
    });

    it('should handle BCRYPT_SALT_ROUNDS as a string number and pass correct value to bcrypt.hash', async () => {
      // This test aims to verify that BCRYPT_SALT_ROUNDS as a string is parsed and used correctly.
      process.env.BCRYPT_SALT_ROUNDS = '15';
      const uuid = 'edge-uuid-15';
      const hashed = 'edge-hash-15';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();
      await service.getHashedPassword();

      expect(mockedBcryptHash).toHaveBeenCalledWith(uuid, 15);
    });

    it('should throw if generateRandomUUID rejects', async () => {
      // This test aims to verify that getHashedPassword propagates errors from generateRandomUUID.
      mockedGenerateRandomUUID.mockRejectedValueOnce(new Error('UUID generation failed'));

      const service = new BcryptService();

      await expect(service.getHashedPassword()).rejects.toThrow('UUID generation failed');
    });

    it('should throw if bcrypt.hash rejects', async () => {
      // This test aims to verify that getHashedPassword propagates errors from bcrypt.hash.
      const uuid = 'uuid-for-hash-error';
      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockRejectedValueOnce(new Error('Hashing failed'));

      const service = new BcryptService();

      await expect(service.getHashedPassword()).rejects.toThrow('Hashing failed');
    });

    it('should handle NANOID_SIZE set to 0', async () => {
      // This test aims to verify behavior when NANOID_SIZE is set to 0.
      process.env.NANOID_SIZE = '0';
      const uuid = '';
      const hashed = 'hash-for-empty-uuid';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();
      const result = await service.getHashedPassword();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(0);
      expect(mockedBcryptHash).toHaveBeenCalledWith('', 10);
      expect(result).toBe(hashed);
    });

    it('should handle BCRYPT_SALT_ROUNDS set to 1', async () => {
      // This test aims to verify behavior when BCRYPT_SALT_ROUNDS is set to 1.
      process.env.BCRYPT_SALT_ROUNDS = '1';
      const uuid = 'uuid-for-salt-1';
      const hashed = 'hash-for-salt-1';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();
      const result = await service.getHashedPassword();

      expect(mockedBcryptHash).toHaveBeenCalledWith(uuid, 1);
      expect(result).toBe(hashed);
    });

    it('should handle NANOID_SIZE and BCRYPT_SALT_ROUNDS as large numbers', async () => {
      // This test aims to verify behavior with large NANOID_SIZE and BCRYPT_SALT_ROUNDS values.
      process.env.NANOID_SIZE = '64';
      process.env.BCRYPT_SALT_ROUNDS = '20';
      const uuid = 'x'.repeat(64);
      const hashed = 'hash-for-large-values';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockResolvedValueOnce(hashed);

      const service = new BcryptService();
      const result = await service.getHashedPassword();

      expect(mockedGenerateRandomUUID).toHaveBeenCalledWith(64);
      expect(mockedBcryptHash).toHaveBeenCalledWith(uuid, 20);
      expect(result).toBe(hashed);
    });

    it('should throw if NANOID_SIZE is not a number', async () => {
      // This test aims to verify that an invalid NANOID_SIZE throws an error.
      process.env.NANOID_SIZE = 'not-a-number';

      const service = new BcryptService();

      // The constructor will parseInt('not-a-number') => NaN, which will be passed to generateRandomUUID
      // If generateRandomUUID expects a number, it may throw, so we simulate that
      mockedGenerateRandomUUID.mockImplementationOnce(() => {
        throw new Error('Invalid size');
      });

      await expect(service.getHashedPassword()).rejects.toThrow('Invalid size');
    });

    it('should throw if BCRYPT_SALT_ROUNDS is not a number', async () => {
      // This test aims to verify that an invalid BCRYPT_SALT_ROUNDS throws an error.
      process.env.BCRYPT_SALT_ROUNDS = 'not-a-number';
      const uuid = 'uuid-for-invalid-salt';

      mockedGenerateRandomUUID.mockResolvedValueOnce(uuid);
      mockedBcryptHash.mockImplementationOnce(() => {
        throw new Error('Invalid salt rounds');
      });

      const service = new BcryptService();

      await expect(service.getHashedPassword()).rejects.toThrow('Invalid salt rounds');
    });
  });
});
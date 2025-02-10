
// Unit tests for: isValidUsername


import { isValidUsername } from '../../../src/utils/inputValidation';


// src/utils/__tests__/inputValidation.test.ts
describe('isValidUsername() isValidUsername method', () => {
  
  // Happy path tests
  describe('Happy Paths', () => {
    it('should return true for a valid username with letters only', () => {
      // Test a valid username with only letters
      expect(isValidUsername('ValidUser')).toBe(true);
    });

    it('should return true for a valid username with letters and numbers', () => {
      // Test a valid username with letters and numbers
      expect(isValidUsername('User123')).toBe(true);
    });

    it('should return true for a valid username with letters, numbers, and underscores', () => {
      // Test a valid username with letters, numbers, and underscores
      expect(isValidUsername('User_123')).toBe(true);
    });

    it('should return true for a valid username with minimum length', () => {
      // Test a valid username with the minimum length of 4 characters
      expect(isValidUsername('User')).toBe(true);
    });

    it('should return true for a valid username with maximum length', () => {
      // Test a valid username with the maximum length of 16 characters
      expect(isValidUsername('ValidUserName123')).toBe(true);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should return false for a username that is too short', () => {
      // Test a username that is shorter than the minimum length
      expect(isValidUsername('Us')).toBe(false);
    });

    it('should return false for a username that is too long', () => {
      // Test a username that exceeds the maximum length
      expect(isValidUsername('ThisUsernameIsWayTooLong')).toBe(false);
    });

    it('should return false for a username starting with a number', () => {
      // Test a username that starts with a number
      expect(isValidUsername('1Invalid')).toBe(false);
    });

    it('should return false for a username starting with an underscore', () => {
      // Test a username that starts with an underscore
      expect(isValidUsername('_Invalid')).toBe(false);
    });

    it('should return false for a username containing invalid characters', () => {
      // Test a username containing invalid characters like special symbols
      expect(isValidUsername('Invalid!@#')).toBe(false);
    });

    it('should return false for an empty username', () => {
      // Test an empty username
      expect(isValidUsername('')).toBe(false);
    });

    it('should return false for a username with spaces', () => {
      // Test a username containing spaces
      expect(isValidUsername('Invalid User')).toBe(false);
    });
  });
});

// End of unit tests for: isValidUsername

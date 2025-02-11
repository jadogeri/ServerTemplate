
// Unit tests for: isValidatePhoneNumber


import { isValidatePhoneNumber } from '../../../src/utils/inputValidation';


// src/utils/__tests__/inputValidation.test.ts
describe('isValidatePhoneNumber() isValidatePhoneNumber method', () => {
  
  // Happy path tests
  describe('Happy Paths', () => {
    it('should return true for a valid phone number with country code and spaces', () => {
      // Test a valid phone number with country code and spaces
      expect(isValidatePhoneNumber('+1 123 456 7890')).toBe(true);
    });

    it('should return true for a valid phone number with country code and dashes', () => {
      // Test a valid phone number with country code and dashes
      expect(isValidatePhoneNumber('+1-123-456-7890')).toBe(true);
    });

    it('should return false for a valid phone number with parentheses and spaces', () => {
      // Test a valid phone number with parentheses and spaces
      expect(isValidatePhoneNumber('(123) 456 7890')).toBe(false);
    });

    it('should return false for a valid phone number without country code', () => {
      // Test a valid phone number without country code
      expect(isValidatePhoneNumber('123-456-7890')).toBe(false);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should return false for a phone number with letters', () => {
      // Test a phone number containing letters
      expect(isValidatePhoneNumber('123-abc-7890')).toBe(false);
    });

    it('should return false for a phone number with special characters', () => {
      // Test a phone number containing special characters
      expect(isValidatePhoneNumber('123-456-7890!')).toBe(false);
    });

    it('should return false for a phone number that is too short', () => {
      // Test a phone number that is too short
      expect(isValidatePhoneNumber('123-45')).toBe(false);
    });

    it('should return false for a phone number that is too long', () => {
      // Test a phone number that is too long
      expect(isValidatePhoneNumber('123-456-789012397879878667')).toBe(false);
    });

    it('should return false for an empty string', () => {
      // Test an empty string
      expect(isValidatePhoneNumber('')).toBe(false);
    });

    it('should return false for a phone number with only spaces', () => {
      // Test a phone number with only spaces
      expect(isValidatePhoneNumber('     ')).toBe(false);
    });

    it('should return false for a phone number with incorrect format', () => {
      // Test a phone number with incorrect format
      expect(isValidatePhoneNumber('1234567890')).toBe(false);
    });
  });
});

// End of unit tests for: isValidatePhoneNumber

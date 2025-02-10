
// Unit tests for: isValidatePhoneNumber


import { isValidatePhoneNumber } from '../../../src/utils/inputValidation';


// src/utils/__tests__/inputValidation.test.ts
describe('isValidatePhoneNumber() isValidatePhoneNumber method', () => {
  
  // Happy path tests
  describe('Happy paths', () => {
    it('should return true for a valid phone number with country code', () => {
      // Test a valid phone number with a country code
      expect(isValidatePhoneNumber('+1-800-555-1234')).toBe(true);
    });

    it('should return true for a valid phone number without country code', () => {
      // Test a valid phone number without a country code
      expect(isValidatePhoneNumber('800-555-1234')).toBe(true);
    });

    it('should return true for a valid phone number with spaces', () => {
      // Test a valid phone number with spaces
      expect(isValidatePhoneNumber('800 555 1234')).toBe(true);
    });

    it('should return true for a valid phone number with dots', () => {
      // Test a valid phone number with dots
      expect(isValidatePhoneNumber('800.555.1234')).toBe(true);
    });

    it('should return true for a valid phone number with parentheses', () => {
      // Test a valid phone number with parentheses around area code
      expect(isValidatePhoneNumber('(800) 555-1234')).toBe(true);
    });
  });

  // Edge case tests
  describe('Edge cases', () => {
    it('should return false for a phone number with letters', () => {
      // Test a phone number containing letters
      expect(isValidatePhoneNumber('800-555-ABCD')).toBe(false);
    });

    it('should return false for a phone number with special characters', () => {
      // Test a phone number containing special characters
      expect(isValidatePhoneNumber('800-555-1234!')).toBe(false);
    });

    it('should return false for a phone number that is too short', () => {
      // Test a phone number that is too short
      expect(isValidatePhoneNumber('800-555')).toBe(false);
    });

    it('should return false for a phone number that is too long', () => {
      // Test a phone number that is too long
      expect(isValidatePhoneNumber('800-555-1234-5678')).toBe(false);
    });

    it('should return false for an empty string', () => {
      // Test an empty string
      expect(isValidatePhoneNumber('')).toBe(false);
    });

    it('should return false for a phone number with only country code', () => {
      // Test a phone number with only a country code
      expect(isValidatePhoneNumber('+1')).toBe(false);
    });

    it('should return false for a phone number with incorrect format', () => {
      // Test a phone number with incorrect format
      expect(isValidatePhoneNumber('123-4567-890')).toBe(false);
    });
  });
});

// End of unit tests for: isValidatePhoneNumber

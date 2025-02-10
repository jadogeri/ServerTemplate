
// Unit tests for: isValidEmail


import { isValidEmail } from '../../../src/utils/inputValidation';


// src/utils/__tests__/inputValidation.test.ts
describe('isValidEmail() isValidEmail method', () => {
  // Happy path tests
  describe('Happy Paths', () => {
    it('should return true for a valid email with simple structure', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should return true for a valid email with subdomain', () => {
      expect(isValidEmail('test@sub.example.com')).toBe(true);
    });

    it('should return true for a valid email with numbers and special characters', () => {
      expect(isValidEmail('user.name+tag+sorting@example.com')).toBe(true);
    });

    it('should return true for a valid email with hyphen in domain', () => {
      expect(isValidEmail('user@domain-name.com')).toBe(true);
    });

    it('should return true for a valid email with underscore in local part', () => {
      expect(isValidEmail('user_name@example.com')).toBe(true);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should return false for an email without "@" symbol', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('should return false for an email without domain', () => {
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should return false for an email without local part', () => {
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should return false for an email with invalid characters', () => {
      expect(isValidEmail('test@exa!mple.com')).toBe(false);
    });

    it('should return false for an email with consecutive dots in local part', () => {
      expect(isValidEmail('user..name@example.com')).toBe(false);
    });

    it('should return false for an email with consecutive dots in domain', () => {
      expect(isValidEmail('user@domain..com')).toBe(false);
    });

    it('should return false for an email with invalid domain extension', () => {
      expect(isValidEmail('user@example.c')).toBe(false);
    });

    it('should return false for an email with domain extension too long', () => {
      expect(isValidEmail('user@example.toolong')).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('should return false for a string with only spaces', () => {
      expect(isValidEmail('   ')).toBe(false);
    });
  });
});

// End of unit tests for: isValidEmail


// Unit tests for: isValidEmail


import { isValidEmail } from '../../../src/utils/inputValidation';


// Import the function to be tested
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
      expect(isValidEmail('user.nametagsorting@example.com')).toBe(true);
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
      expect(isValidEmail('test.example.com')).toBe(false);
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

    it('should return false for an email with consecutive dots in domain', () => {
      expect(isValidEmail('test@mplehih..com')).toBe(false);
    });

    it('should return false for an email with a domain that is too short', () => {
      expect(isValidEmail('test@example.c')).toBe(false);
    });

    it('should return false for an email with a domain that is too long', () => {
      expect(isValidEmail('test@manchesterunited.commerical')).toBe(false);
    });

    it('should return false for an email with spaces', () => {
      expect(isValidEmail('test @example.com')).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('should return false for an email with only special characters', () => {
      expect(isValidEmail('!@#$%^&*()')).toBe(false);
    });
  });
});

// End of unit tests for: isValidEmail

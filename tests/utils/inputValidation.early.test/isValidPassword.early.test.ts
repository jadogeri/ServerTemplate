
// Unit tests for: isValidPassword


import { isValidPassword } from '../../../src/utils/inputValidation';


describe('isValidPassword() isValidPassword method', () => {
  // Happy path tests
  describe('Happy Paths', () => {
    it('should return true for a valid password with all required character types', () => {
      const password = 'Valid1#';
      expect(isValidPassword(password)).toBe(true);
    });

    it('should return true for a valid password at the minimum length', () => {
      const password = 'Aa1#bc';
      expect(isValidPassword(password)).toBe(true);
    });

    it('should return true for a valid password at the maximum length', () => {
      const password = 'Aa1#bcdefghijklm';
      expect(isValidPassword(password)).toBe(true);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should return false for a password shorter than the minimum length', () => {
      const password = 'Aa1#b';
      expect(isValidPassword(password)).toBe(false);
    });

    it('should return false for a password longer than the maximum length', () => {
      const password = 'Aa1#bcdefghijklmnop';
      expect(isValidPassword(password)).toBe(false);
    });

    it('should return false for a password without a lowercase letter', () => {
      const password = 'A1#BCDE';
      expect(isValidPassword(password)).toBe(false);
    });

    it('should return false for a password without an uppercase letter', () => {
      const password = 'a1#bcde';
      expect(isValidPassword(password)).toBe(false);
    });

    it('should return false for a password without a digit', () => {
      const password = 'Aa#bcde';
      expect(isValidPassword(password)).toBe(false);
    });

    it('should return false for a password without a special character', () => {
      const password = 'Aa1bcde';
      expect(isValidPassword(password)).toBe(false);
    });

    it('should return false for an empty password', () => {
      const password = '';
      expect(isValidPassword(password)).toBe(false);
    });

    it('should return false for a password with only special characters', () => {
      const password = '#$@!%&*?';
      expect(isValidPassword(password)).toBe(false);
    });

    it('should return false for a password with only digits', () => {
      const password = '123456';
      expect(isValidPassword(password)).toBe(false);
    });

    it('should return false for a password with only uppercase letters', () => {
      const password = 'ABCDEF';
      expect(isValidPassword(password)).toBe(false);
    });

    it('should return false for a password with only lowercase letters', () => {
      const password = 'abcdef';
      expect(isValidPassword(password)).toBe(false);
    });
  });
});

// End of unit tests for: isValidPassword

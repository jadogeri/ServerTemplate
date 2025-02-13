
// Unit tests for: loadTemplate


import { loadTemplate } from '../../../../../src/tools/mail/utils/loadTemplate';
import { Recipient } from "../../../../../src/types/Recipient";


// Mock the EmailTemplate class
jest.mock("../../../../../src/configs/nodemailer", () => ({
  EmailTemplate: jest.fn().mockImplementation(() => ({
    render: jest.fn((context, callback) => {
      if (context.email === 'error@example.com') {
        callback(new Error('Rendering error'), null);
      } else {
        callback(null, `Rendered content for ${context.username}`);
      }
    }),
  })),
}));

describe('loadTemplate() loadTemplate method', () => {
  // Happy path tests
  describe('Happy paths', () => {
    it('should render templates for all recipients successfully', async () => {
      const recipients: Recipient[] = [
        { username: 'John', email: 'john@example.com', company: 'CompanyA' },
        { username: 'Jane', email: 'jane@example.com', company: 'CompanyB' },
      ];

      const result = await loadTemplate('welcome', recipients);

      expect(result).toEqual([
        { email: 'Rendered content for John', context: recipients[0] },
        { email: 'Rendered content for Jane', context: recipients[1] },
      ]);
    });

    it('should handle an empty list of recipients gracefully', async () => {
      const recipients: Recipient[] = [];

      const result = await loadTemplate('welcome', recipients);

      expect(result).toEqual([]);
    });
  });

  // Edge case tests
  describe('Edge cases', () => {
    it('should handle a recipient with undefined fields', async () => {
      const recipients: Recipient[] = [
        { username: undefined, email: undefined, company: undefined },
      ];

      const result = await loadTemplate('welcome', recipients);

      expect(result).toEqual([
        { email: 'Rendered content for undefined', context: recipients[0] },
      ]);
    });

    it('should reject with an error if rendering fails for a recipient', async () => {
      const recipients: Recipient[] = [
        { username: 'ErrorUser', email: 'error@example.com', company: 'CompanyC' },
      ];

      await expect(loadTemplate('welcome', recipients)).rejects.toThrow('Rendering error');
    });

    it('should handle a mix of successful and failing renders', async () => {
      const recipients: Recipient[] = [
        { username: 'John', email: 'john@example.com', company: 'CompanyA' },
        { username: 'ErrorUser', email: 'error@example.com', company: 'CompanyC' },
      ];

      await expect(loadTemplate('welcome', recipients)).rejects.toThrow('Rendering error');
    });
  });
});

// End of unit tests for: loadTemplate

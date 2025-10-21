
// Unit tests for: loadTemplate


import { loadTemplate } from '../../../../../src/tools/mail/utils/loadTemplate';
import { Recipient } from "../../../../../src/types/Recipient";


// Mocking the EmailTemplate class from 'email-templates'
jest.mock("email-templates", () => {
  return {
    EmailTemplate: jest.fn().mockImplementation(() => {
      return {
        render: jest.fn((recipient, callback) => {
          if (recipient.username === 'error') {
            callback(new Error('Rendering error'), null);
          } else {
            callback(null, {
              subject: 'Test Subject',
              html: '<p>Test HTML</p>',
              text: 'Test Text',
            });
          }
        }),
      };
    }),
  };
});

describe('loadTemplate() loadTemplate method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should successfully load and render a template for a valid recipient', async () => {
      const recipient: Recipient = {
        username: 'testuser',
        email: 'test@example.com',
        company: 'Test Company',
      };

      const result = await loadTemplate('testTemplate', recipient);

      expect(result).toEqual({
        email: {
          subject: 'Test Subject',
          html: '<p>Test HTML</p>',
          text: 'Test Text',
        },
        recipient,
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle rendering errors gracefully', async () => {
      const recipient: Recipient = {
        username: 'error',
        email: 'error@example.com',
        company: 'Error Company',
      };

      await expect(loadTemplate('errorTemplate', recipient)).rejects.toThrow('Rendering error');
    });

    it('should handle undefined recipient fields gracefully', async () => {
      const recipient: Recipient = {
        username: undefined,
        email: undefined,
        company: undefined,
      };

      const result = await loadTemplate('testTemplate', recipient);

      expect(result).toEqual({
        email: {
          subject: 'Test Subject',
          html: '<p>Test HTML</p>',
          text: 'Test Text',
        },
        recipient,
      });
    });

    it('should handle missing optional fields in recipient', async () => {
      const recipient: Recipient = {
        username: 'testuser',
        email: 'test@example.com',
        company: 'Test Company',
        // password is optional and not provided
      };

      const result = await loadTemplate('testTemplate', recipient);

      expect(result).toEqual({
        email: {
          subject: 'Test Subject',
          html: '<p>Test HTML</p>',
          text: 'Test Text',
        },
        recipient,
      });
    });
  });
});

// End of unit tests for: loadTemplate

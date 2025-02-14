
// Unit tests for: loadTemplate


import { EmailTemplate } from "../../../../configs/nodemailer";
import { Recipient } from "../../../../types/Recipient";
import { loadTemplate } from '../loadTemplate';


// Mock the EmailTemplate class
jest.mock("../../../../configs/nodemailer", () => ({
  EmailTemplate: jest.fn().mockImplementation(() => ({
    render: jest.fn(),
  })),
}));

describe('loadTemplate() loadTemplate method', () => {
  let mockRender: jest.Mock;

  beforeEach(() => {
    // Reset the mock before each test
    mockRender = (EmailTemplate as jest.Mock).mock.instances[0].render;
  });

  describe('Happy paths', () => {
    it('should resolve with email and recipient when template renders successfully', async () => {
      // Arrange
      const templateName = 'welcome';
      const recipient: Recipient = {
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        company: 'ExampleCorp',
      };
      const mockResult = {
        subject: 'Welcome!',
        html: '<h1>Welcome, JohnDoe!</h1>',
        text: 'Welcome, JohnDoe!',
      };

      mockRender.mockImplementation((_, callback) => {
        callback(null, mockResult);
      });

      // Act
      const result = await loadTemplate(templateName, recipient);

      // Assert
      expect(result).toEqual({
        email: mockResult,
        recipient: recipient,
      });
    });
  });

  describe('Edge cases', () => {
    it('should reject with an error when template rendering fails', async () => {
      // Arrange
      const templateName = 'errorTemplate';
      const recipient: Recipient = {
        username: 'JaneDoe',
        email: 'jane.doe@example.com',
        company: 'ExampleCorp',
      };
      const mockError = new Error('Rendering failed');

      mockRender.mockImplementation((_, callback) => {
        callback(mockError, null);
      });

      // Act & Assert
      await expect(loadTemplate(templateName, recipient)).rejects.toThrow('Rendering failed');
    });

    it('should handle undefined recipient fields gracefully', async () => {
      // Arrange
      const templateName = 'undefinedFields';
      const recipient: Recipient = {
        username: undefined,
        email: undefined,
        company: undefined,
      };
      const mockResult = {
        subject: 'Hello!',
        html: '<h1>Hello, Guest!</h1>',
        text: 'Hello, Guest!',
      };

      mockRender.mockImplementation((_, callback) => {
        callback(null, mockResult);
      });

      // Act
      const result = await loadTemplate(templateName, recipient);

      // Assert
      expect(result).toEqual({
        email: mockResult,
        recipient: recipient,
      });
    });
  });
});

// End of unit tests for: loadTemplate

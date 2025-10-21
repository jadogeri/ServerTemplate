
// Unit tests for: transportMail


import { transporter } from "../../../../../src/configs/nodemailer";
import transportMail from '../../../../../src/tools/mail/utils/transportMail';


// src/tools/mail/utils/__tests__/transportMail.test.ts
// Mock the transporter object
jest.mock("../../../../../src/configs/nodemailer", () => ({
  transporter: {
    sendMail: jest.fn(),
  },
}));

describe('transportMail() transportMail method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should send an email successfully with valid mail object', async () => {
      // Arrange
      const mail = {
        to: 'recipient@example.com',
        from: 'sender@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML content</p>',
        text: 'Test text content',
      };
      (transporter.sendMail as jest.Mock).mockResolvedValueOnce('Email sent');

      // Act
      const result = await transportMail(mail);

      // Assert
      expect(transporter.sendMail).toHaveBeenCalledWith(mail);
      expect(result).toBe('Email sent');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw an error if sendMail fails', async () => {
      // Arrange
      const mail = {
        to: 'recipient@example.com',
        from: 'sender@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML content</p>',
        text: 'Test text content',
      };
      const errorMessage = 'Failed to send email';
      (transporter.sendMail as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(transportMail(mail)).rejects.toThrow(errorMessage);
    });

    it('should handle missing fields in the mail object gracefully', async () => {
      // Arrange
      const mail = {
        to: 'recipient@example.com',
        from: 'sender@example.com',
        // Missing subject, html, and text
      };
      (transporter.sendMail as jest.Mock).mockResolvedValueOnce('Email sent');

      // Act
      const result = await transportMail(mail);

      // Assert
      expect(transporter.sendMail).toHaveBeenCalledWith(mail);
      expect(result).toBe('Email sent');
    });

    it('should handle an empty mail object', async () => {
      // Arrange
      const mail = {};
      (transporter.sendMail as jest.Mock).mockResolvedValueOnce('Email sent');

      // Act
      const result = await transportMail(mail);

      // Assert
      expect(transporter.sendMail).toHaveBeenCalledWith(mail);
      expect(result).toBe('Email sent');
    });
  });
});

// End of unit tests for: transportMail

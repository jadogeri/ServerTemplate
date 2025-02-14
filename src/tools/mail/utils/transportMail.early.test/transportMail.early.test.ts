
// Unit tests for: transportMail


import { transporter } from "../../../../configs/nodemailer";
import transportMail from '../transportMail';


// src/tools/mail/utils/__tests__/transportMail.test.ts
// Mock the transporter object
jest.mock("../../../../configs/nodemailer", () => ({
  transporter: {
    sendMail: jest.fn(),
  },
}));

describe('transportMail() transportMail method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Path Tests', () => {
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
  describe('Edge Case Tests', () => {
    it('should handle missing "to" field gracefully', async () => {
      // Arrange
      const mail = {
        from: 'sender@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML content</p>',
        text: 'Test text content',
      };
      (transporter.sendMail as jest.Mock).mockRejectedValueOnce(new Error('Missing "to" field'));

      // Act & Assert
      await expect(transportMail(mail)).rejects.toThrow('Missing "to" field');
      expect(transporter.sendMail).toHaveBeenCalledWith(mail);
    });

    it('should handle missing "from" field gracefully', async () => {
      // Arrange
      const mail = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML content</p>',
        text: 'Test text content',
      };
      (transporter.sendMail as jest.Mock).mockRejectedValueOnce(new Error('Missing "from" field'));

      // Act & Assert
      await expect(transportMail(mail)).rejects.toThrow('Missing "from" field');
      expect(transporter.sendMail).toHaveBeenCalledWith(mail);
    });

    it('should handle transporter failure gracefully', async () => {
      // Arrange
      const mail = {
        to: 'recipient@example.com',
        from: 'sender@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML content</p>',
        text: 'Test text content',
      };
      (transporter.sendMail as jest.Mock).mockRejectedValueOnce(new Error('Transporter error'));

      // Act & Assert
      await expect(transportMail(mail)).rejects.toThrow('Transporter error');
      expect(transporter.sendMail).toHaveBeenCalledWith(mail);
    });
  });
});

// End of unit tests for: transportMail

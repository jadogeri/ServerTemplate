
// Unit tests for: sendEmail


import { transporter } from "../../../../../src/configs/nodemailer";
import sendEmail from '../../../../../src/tools/mail/utils/transportMail';


// Import necessary modules and functions
// Mock the transporter object
jest.mock("../../../../../src/configs/nodemailer", () => ({
  transporter: {
    sendMail: jest.fn(),
  },
}));

describe('sendEmail() sendEmail method', () => {
  // Happy path tests
  describe('Happy paths', () => {
    it('should send an email with valid object', async () => {
      // Arrange: Set up the mock implementation and input object
      const emailObj = { to: 'test@example.com', subject: 'Test', text: 'Hello' };
      (transporter.sendMail as jest.Mock).mockResolvedValueOnce('Email sent');

      // Act: Call the sendEmail function
      const result = await sendEmail(emailObj);

      // Assert: Verify the sendMail method was called with the correct object
      expect(transporter.sendMail).toHaveBeenCalledWith(emailObj);
      expect(result).toBe('Email sent');
    });

    it('should handle sending email with additional properties', async () => {
      // Arrange: Set up the mock implementation and input object with additional properties
      const emailObj = { to: 'test@example.com', subject: 'Test', text: 'Hello', cc: 'cc@example.com' };
      (transporter.sendMail as jest.Mock).mockResolvedValueOnce('Email sent');

      // Act: Call the sendEmail function
      const result = await sendEmail(emailObj);

      // Assert: Verify the sendMail method was called with the correct object
      expect(transporter.sendMail).toHaveBeenCalledWith(emailObj);
      expect(result).toBe('Email sent');
    });
  });

  // Edge case tests
  describe('Edge cases', () => {
    it('should handle empty object gracefully', async () => {
      // Arrange: Set up the mock implementation and input object
      const emailObj = {};
      (transporter.sendMail as jest.Mock).mockResolvedValueOnce('Email sent');

      // Act: Call the sendEmail function
      const result = await sendEmail(emailObj);

      // Assert: Verify the sendMail method was called with the correct object
      expect(transporter.sendMail).toHaveBeenCalledWith(emailObj);
      expect(result).toBe('Email sent');
    });

    it('should handle null object gracefully', async () => {
      // Arrange: Set up the mock implementation
      const emailObj = null;
      (transporter.sendMail as jest.Mock).mockRejectedValueOnce(new Error('Invalid email object'));

      // Act & Assert: Call the sendEmail function and expect it to throw an error
      await expect(sendEmail(emailObj)).rejects.toThrow('Invalid email object');
    });

    it('should handle transporter.sendMail throwing an error', async () => {
      // Arrange: Set up the mock implementation to throw an error
      const emailObj = { to: 'test@example.com', subject: 'Test', text: 'Hello' };
      (transporter.sendMail as jest.Mock).mockRejectedValueOnce(new Error('Failed to send email'));

      // Act & Assert: Call the sendEmail function and expect it to throw an error
      await expect(sendEmail(emailObj)).rejects.toThrow('Failed to send email');
    });
  });
});

// End of unit tests for: sendEmail

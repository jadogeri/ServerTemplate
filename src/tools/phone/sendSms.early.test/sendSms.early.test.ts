
// Unit tests for: sendSms


import { twilioClient, twilioPhoneNumber } from "../../../configs/twilio";
import { Recipient } from "../../../types/Recipient";
import { sendSms } from '../sendSms';


// Import necessary modules and dependencies
// Mock the Twilio client
jest.mock("../../../configs/twilio", () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
  twilioPhoneNumber: '+1234567890',
}));

describe('sendSms() sendSms method', () => {
  // Happy path tests
  describe('Happy paths', () => {
    it('should send an SMS successfully with valid recipient phone number and recipient object', async () => {
      // Arrange
      const recipientPhoneNumber = '+19876543210';
      const recipient: Recipient = {
        username: 'john_doe',
        email: 'john@example.com',
        company: 'Example Inc.',
      };

      // Mock the Twilio client's create method to resolve successfully
      (twilioClient.messages.create as jest.Mock).mockResolvedValue({ sid: 'SM1234567890' });

      // Act
      await sendSms(recipientPhoneNumber, recipient);

      // Assert
      expect(twilioClient.messages.create).toHaveBeenCalledWith({
        from: twilioPhoneNumber,
        to: recipientPhoneNumber,
        body: 'Hello from Twilio and TypeScript!',
      });
    });
  });

  // Edge case tests
  describe('Edge cases', () => {
    it('should handle an error when Twilio client fails to send an SMS', async () => {
      // Arrange
      const recipientPhoneNumber = '+19876543210';
      const recipient: Recipient = {
        username: 'john_doe',
        email: 'john@example.com',
        company: 'Example Inc.',
      };

      // Mock the Twilio client's create method to reject with an error
      const error = new Error('Failed to send SMS');
      (twilioClient.messages.create as jest.Mock).mockRejectedValue(error);

      // Spy on console.error to verify error handling
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await sendSms(recipientPhoneNumber, recipient);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(`Error sending SMS: ${error}`);
      consoleErrorSpy.mockRestore();
    });

    it('should handle an empty recipient phone number gracefully', async () => {
      // Arrange
      const recipientPhoneNumber = '';
      const recipient: Recipient = {
        username: 'john_doe',
        email: 'john@example.com',
        company: 'Example Inc.',
      };

      // Act
      await sendSms(recipientPhoneNumber, recipient);

      // Assert
      expect(twilioClient.messages.create).not.toHaveBeenCalled();
    });

    it('should handle undefined recipient object gracefully', async () => {
      // Arrange
      const recipientPhoneNumber = '+19876543210';
      const recipient = undefined;

      // Act
      await sendSms(recipientPhoneNumber, recipient as unknown as Recipient);

      // Assert
      expect(twilioClient.messages.create).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: sendSms


// Unit tests for: sendEmail


import { loadTemplate } from "../../../../../src/tools/mail/utils/loadTemplate";
import { sendEmail } from '../../../../../src/tools/mail/utils/sendEmail';
import transportMail from "../../../../../src/tools/mail/utils/transportMail";
import { Mail } from "../../../../../src/types/Mail";
import { Recipient } from "../../../../../src/types/Recipient";

// Mocking the loadTemplate and transportMail functions
jest.mock("../../../../../src/tools/mail/utils/loadTemplate", () => {
  const actual = jest.requireActual("../../../../../src/tools/mail/utils/loadTemplate");
  return {
    ...actual,
    loadTemplate: jest.fn(),
  };
});

jest.mock("../../../../../src/tools/mail/utils/transportMail", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('sendEmail() sendEmail method', () => {
  const mockRecipient: Recipient = {
    username: 'testuser',
    email: 'test@example.com',
    company: 'TestCompany',
  };

  const mockMail: Mail = {
    to: 'test@example.com',
    from: 'TestCompany',
    subject: 'Test Subject',
    html: '<p>Test HTML</p>',
    text: 'Test Text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should send an email successfully with valid template and recipient', async () => {
      // Arrange
      (loadTemplate as jest.Mock).mockResolvedValue({
        recipient: { email: mockRecipient.email },
        email: {
          subject: mockMail.subject,
          html: mockMail.html,
          text: mockMail.text,
        },
      });
      (transportMail as jest.Mock).mockResolvedValue(undefined);

      // Act
      await sendEmail('validTemplate', mockRecipient);

      // Assert
      expect(loadTemplate).toHaveBeenCalledWith('validTemplate', mockRecipient);
      expect(transportMail).toHaveBeenCalledWith(mockMail);
    });
  });

  describe('Edge cases', () => {
    it('should handle loadTemplate rejection gracefully', async () => {
      // Arrange
      const error =  new Error('Template loading failed');
      (loadTemplate as jest.Mock).mockRejectedValue(error);

      // Act
      await sendEmail('invalidTemplate', mockRecipient);

      // Assert
      expect(loadTemplate).toHaveBeenCalledWith('invalidTemplate', mockRecipient);
      expect(transportMail).not.toHaveBeenCalled();
    });

    it('should handle transportMail rejection gracefully', async () => {
      // Arrange
      (loadTemplate as jest.Mock).mockResolvedValue({
        recipient: { email: mockRecipient.email },
        email: {
          subject: mockMail.subject,
          html: mockMail.html,
          text: mockMail.text,
        },
      });
      const error = new Error('Email sending failed');
      (transportMail as jest.Mock).mockRejectedValue(error);

      // Act
      await sendEmail('validTemplate', mockRecipient);

      // Assert
      expect(loadTemplate).toHaveBeenCalledWith('validTemplate', mockRecipient);
      expect(transportMail).toHaveBeenCalledWith(mockMail);
    });

    it('should handle missing recipient email gracefully', async () => {
      // Arrange
      const recipientWithoutEmail: Recipient = { ...mockRecipient, email: undefined };
      (loadTemplate as jest.Mock).mockResolvedValue({
        recipient: { email: undefined },
        email: {
          subject: mockMail.subject,
          html: mockMail.html,
          text: mockMail.text,
        },
      });

      // Act
      await sendEmail('validTemplate', recipientWithoutEmail);

      // Assert
      expect(loadTemplate).toHaveBeenCalledWith('validTemplate', recipientWithoutEmail);
      expect(transportMail).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: sendEmail

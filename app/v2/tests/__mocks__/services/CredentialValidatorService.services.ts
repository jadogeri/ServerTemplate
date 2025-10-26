import { ICredentialValidatorService } from "../../../src/interfaces/ICredentialValidatorService";

export const mockCredentialValidatorService: jest.Mocked<ICredentialValidatorService> = {
    
  validateRegistration: jest.fn(),

  validateLogin: jest.fn(),

  validateForgotPassword: jest.fn(),

  validateLogout: jest.fn(),

  validateResetPassword: jest.fn(),

  validateDeactivate: jest.fn(),

};
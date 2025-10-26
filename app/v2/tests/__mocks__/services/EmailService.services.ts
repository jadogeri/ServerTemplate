import { IEmailService } from "../../../src/interfaces/IEmailService";
export const mockEmailService: jest.Mocked<IEmailService> = {
    
    sendEmail: jest.fn(),

};
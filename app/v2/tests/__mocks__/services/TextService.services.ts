import { ITextService } from "../../../src/interfaces/ITextService";

export const mockTextService: jest.Mocked<ITextService> = {
    
    sendSms: jest.fn(),

};
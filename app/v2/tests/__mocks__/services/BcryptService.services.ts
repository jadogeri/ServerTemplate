import { IBcryptService } from "../../../src/interfaces/IBcryptService";

export const mockBcryptService: jest.Mocked<IBcryptService> = {
    
    updateUUID: jest.fn(),

    getUUID: jest.fn(),

    getHashedPassword: jest.fn(),
};
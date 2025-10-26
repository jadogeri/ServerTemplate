import { IAuthService } from "../../../src/interfaces/IAuthService";

export const mockAuthService: jest.Mocked<IAuthService> = {

    findByUserId: jest.fn(), 
    create: jest.fn(), 
    update: jest.fn(), 
    findByToken: jest.fn(), 
    remove: jest.fn(), 
    removeByUserID: jest.fn(), 
    
};
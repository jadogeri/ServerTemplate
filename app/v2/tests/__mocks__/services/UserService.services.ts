import { IUserService } from "../../../src/interfaces/IUserService";

export const mockUserService: jest.Mocked<IUserService> = {
    
    registerUser: jest.fn(),
    
    loginUser: jest.fn(),

    forgotUser: jest.fn(),

    logoutUser: jest.fn(),

    deactivateUser: jest.fn(),

    resetUser: jest.fn(),    

};
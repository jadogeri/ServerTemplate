// __mocks__/UserRepository.ts (optional, can be in test file)
import { IAuthRepository } from '../../../src/interfaces/IAuthRepository';

export const mockAuthRepository: jest.Mocked<IAuthRepository> = {
    
    findByUserId: jest.fn(),

    findByToken: jest.fn(),

    create: jest.fn(),

    update: jest.fn(),

    remove: jest.fn(),
};


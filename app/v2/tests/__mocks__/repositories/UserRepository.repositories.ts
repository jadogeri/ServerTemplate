// __mocks__/UserRepository.ts (optional, can be in test file)
import { IUserRepository } from '../../../src/interfaces/IUserRepository';

export const mockUserRepository: jest.Mocked<IUserRepository> = {
    
    findByEmail: jest.fn(),

    findByUsername: jest.fn(),

    create: jest.fn(),

    delete: jest.fn(),

    update: jest.fn(),

    remove: jest.fn(),
};
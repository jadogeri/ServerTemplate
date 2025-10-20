// __mocks__/user.model.ts

import { Model } from 'mongoose';

export const mockUserModel = Model as jest.MockedClass<typeof Model>;


jest.mock('../../src/models/userModel', () => ({
  User: jest.fn().mockResolvedValue(() => ({
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    // Add other methods you need to mock
  })),
}));
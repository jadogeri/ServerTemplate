
// Unit tests for: update


import mongoose from "mongoose";
import Auth from "../../../src/models/authModel";
import { update } from '../../../src/services/authService';


// Mocking mongoose and User model
jest.mock("mongoose", () => ({
  Types: {
    ObjectId: jest.fn(),
  },
}));

jest.mock("../../../src/models/authModel", () => ({
  findOneAndUpdate: jest.fn(),
  updateOne: jest.fn(),
  findOne : jest.fn()
    
  
}));


/*********************************************************** */
// Mocking the mongoose and Auth dependencies
// jest.mock("mongoose");
//jest.mock("../../../src/models/authModel");


// MockIAuth interface to simulate IAuth
interface MockIAuth {
  token?: string;
  id: mongoose.Types.ObjectId;
}

// Test suite for the update function
describe('update() update method', () => {
  let mockAuth: MockIAuth;

  beforeEach(() => {
    // Initialize mockAuth with default values
    mockAuth = {
      token: 'sampleToken',
      id: new mongoose.Types.ObjectId(),
    } as any;
  });

  // Happy path test: Ensure updateOne is called with correct parameters
  it('should call updateOne with correct filter and update object', async () => {
    // Arrange
    const updateOneMock = jest.mocked(Auth.updateOne).mockResolvedValue({ nModified: 1 } as any);

    // Act
    const result = await update(mockAuth as any);

    // Assert
    expect(updateOneMock).toHaveBeenCalledWith(
      { id: mockAuth.id },
      { $set: { token: mockAuth.token } },
      { upsert: true }
    );
    expect(result).toEqual({ nModified: 1 });
  });

  // Edge case test: Handle missing token
  it('should handle missing token gracefully', async () => {
    // Arrange
    mockAuth.token = undefined;
    const updateOneMock = jest.mocked(Auth.updateOne).mockResolvedValue({ nModified: 0 } as any);

    // Act
    const result = await update(mockAuth as any);

    // Assert
    expect(updateOneMock).toHaveBeenCalledWith(
      { id: mockAuth.id },
      { $set: { token: undefined as any} },
      { upsert: true }
    );
    expect(result).toEqual({ nModified: 0 });
  });

  // Edge case test: Handle invalid ObjectId
  it('should handle invalid ObjectId', async () => {
    // Arrange
    mockAuth.id = 'invalidObjectId' as any;
    const updateOneMock = jest.mocked(Auth.updateOne).mockRejectedValue(new Error('Invalid ObjectId') as never);

    // Act & Assert
    await expect(update(mockAuth as any)).rejects.toThrow('Invalid ObjectId');
    expect(updateOneMock).toHaveBeenCalledWith(
      { id: mockAuth.id },
      { $set: { token: mockAuth.token } },
      { upsert: true }
    );
  });

  // Edge case test: Handle database error
  it('should handle database error', async () => {
    // Arrange
    const updateOneMock = jest.mocked(Auth.updateOne).mockRejectedValue(new Error('Database error') as never);

    // Act & Assert
    await expect(update(mockAuth as any)).rejects.toThrow('Database error');
    expect(updateOneMock).toHaveBeenCalledWith(
      { id: mockAuth.id },
      { $set: { token: mockAuth.token } },
      { upsert: true }
    );
  });
});

// End of unit tests for: update

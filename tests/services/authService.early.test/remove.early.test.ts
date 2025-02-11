
// Unit tests for: remove


import mongoose from "mongoose";
import { IAuth } from "../../../src/interfaces/IAuth";
import Auth from "../../../src/models/authModel";
import { remove } from '../../../src/services/authService';




jest.mock("../../../src/models/authModel");

describe('remove() remove method', () => {
  // Happy Path Tests
  describe("Happy Path", () => {
    it("should successfully remove an auth document when a valid auth object is provided", async () => {
      // Arrange
      const auth: IAuth = { id: new mongoose.Types.ObjectId(), token: "validToken" };
      (Auth.findOneAndDelete as jest.Mock).mockResolvedValue(auth);

      // Act
      const result = await remove(auth);

      // Assert
      expect(Auth.findOneAndDelete).toHaveBeenCalledWith(auth);
      expect(result).toEqual(auth);
    });

    it("should return null if no auth document matches the provided auth object", async () => {
      // Arrange
      const auth: IAuth = { id: new mongoose.Types.ObjectId(), token: "nonExistentToken" };
      (Auth.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await remove(auth);

      // Assert
      expect(Auth.findOneAndDelete).toHaveBeenCalledWith(auth);
      expect(result).toBeNull();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle the case where the auth object is missing the token", async () => {
      // Arrange
      const auth: Partial<IAuth> = { id: new mongoose.Types.ObjectId() };
      (Auth.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await remove(auth as IAuth);

      // Assert
      expect(Auth.findOneAndDelete).toHaveBeenCalledWith(auth);
      expect(result).toBeNull();
    });

    it("should handle the case where the auth object is missing the id", async () => {
      // Arrange
      const auth: Partial<IAuth> = { token: "someToken" };
      (Auth.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await remove(auth as IAuth);

      // Assert
      expect(Auth.findOneAndDelete).toHaveBeenCalledWith(auth);
      expect(result).toBeNull();
    });

    it("should handle the case where the auth object is completely empty", async () => {
      // Arrange
      const auth: Partial<IAuth> = {};
      (Auth.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await remove(auth as IAuth);

      // Assert
      expect(Auth.findOneAndDelete).toHaveBeenCalledWith(auth);
      expect(result).toBeNull();
    });

    it("should throw an error if the database operation fails", async () => {
      // Arrange
      const auth: IAuth = { id: new mongoose.Types.ObjectId(), token: "validToken" };
      (Auth.findOneAndDelete as jest.Mock).mockRejectedValue(new Error("Database error"));

      // Act & Assert
      await expect(remove(auth)).rejects.toThrow("Database error");
    });
  });
});

// End of unit tests for: remove

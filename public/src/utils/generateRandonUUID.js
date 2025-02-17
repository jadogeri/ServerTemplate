"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomUUID = generateRandomUUID;
const nolookalikes_1 = __importDefault(require("nanoid-dictionary/nolookalikes"));
/**
   * Generates a random string of specified length using a set of characters
   * defined in 'nolookalikes'. This can be used for creating unique identifiers.
   *
   * @param length - The length of the random string to be generated.
   * @returns A random string of the specified length.
   * @throws Will throw an error if the length is less than 1.
   */
function generateRandomUUID(length) {
    if (length < 0) {
        throw new Error("Invalid length");
    }
    const characters = nolookalikes_1.default;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
//# sourceMappingURL=generateRandonUUID.js.map
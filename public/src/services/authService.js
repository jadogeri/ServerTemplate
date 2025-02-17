"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = getById;
exports.getByToken = getByToken;
exports.create = create;
exports.update = update;
exports.remove = remove;
const authModel_1 = __importDefault(require("../models/authModel"));
/**
   * Retrieves an authentication record by its unique identifier.
   * @param id - The unique identifier of the authentication record (ObjectId).
   * @returns A promise that resolves to the found authentication record or null if not found.
   * @throws Throws an error if the database query fails.
   */
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return authModel_1.default.findOne({ id: id });
    });
}
/**
 * Retrieves an authentication record by the provided token.
 * @param token - The token string used to find the corresponding Auth record.
 * @returns A promise that resolves to the found Auth record or null if not found.
 * @throws Throws an error if the database query fails.
 */
function getByToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return authModel_1.default.findOne({ token: token });
    });
}
/**
 * Creates a new user in the database.
 * @param user - An object implementing the IUser interface representing the user to be created.
 * @returns A promise that resolves to the created user object.
 * @throws Throws an error if the user creation fails due to validation or database issues.
 */
function create(auth) {
    return __awaiter(this, void 0, void 0, function* () {
        return authModel_1.default.create(auth);
    });
}
/**
 * Updates a user document in the database by its ID.
 * If the user does not exist, a new document will be created.
 * @param _id - The ID of the user to update.
 * @param user - The user data to update or insert.
 * @returns A promise that resolves to the updated or created user document.
 * @throws MongooseError if the update operation fails.
 */
function update(auth) {
    return __awaiter(this, void 0, void 0, function* () {
        return authModel_1.default.updateOne({ id: auth.id }, // Filter
        { $set: { token: auth.token } }, // Update
        { upsert: true });
    });
}
/**
 * Deletes a user from the database by their unique identifier.
 * @param _id - The ObjectId of the user to be deleted.
 * @returns A promise that resolves to the deleted user document or null if not found.
 * @throws MongooseError if there is an issue with the database operation.
 */
function remove(auth) {
    return __awaiter(this, void 0, void 0, function* () {
        return authModel_1.default.findOneAndDelete(auth);
    });
}
//# sourceMappingURL=authService.js.map
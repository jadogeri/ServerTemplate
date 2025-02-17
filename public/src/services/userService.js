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
exports.getByEmail = getByEmail;
exports.getByUsername = getByUsername;
exports.create = create;
exports.remove = remove;
exports.update = update;
const userModel_1 = __importDefault(require("../models/userModel"));
/**
 * Retrieves a user from the database by their email address.
 * @param email - The email address of the user to find.
 * @returns A promise that resolves to the user object or null if not found.
 * @throws Throws an error if the database query fails.
 */
function getByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return userModel_1.default.findOne({ email: email });
    });
}
/**
 * Retrieves a user from the database by their username.
 * @param username - The username of the user to be retrieved.
 * @returns A promise that resolves to the user object or null if not found.
 * @throws Throws an error if the database query fails.
 */
function getByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return userModel_1.default.findOne({ username: username });
    });
}
/**
 * Creates a new user in the database.
 * @param user - An object implementing the IUser interface representing the user to be created.
 * @returns A promise that resolves to the created user object.
 * @throws Throws an error if the user creation fails due to validation or database issues.
 */
function create(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return userModel_1.default.create(user);
    });
}
/**
 * Deletes a user from the database by their unique identifier.
 * @param _id - The ObjectId of the user to be deleted.
 * @returns A promise that resolves to the deleted user document or null if not found.
 * @throws MongooseError if there is an issue with the database operation.
 */
function remove(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return userModel_1.default.findByIdAndDelete(_id);
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
function update(_id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        return userModel_1.default.findOneAndUpdate({ _id: _id }, { $set: user }, { upsert: true });
    });
}
//# sourceMappingURL=userService.js.map
import mongoose from "mongoose";
import User from "../models/userModel";
import { IUser } from "../interfaces/IUser";



/**
 * Retrieves a user from the database by their email address.
 * @param email - The email address of the user to find.
 * @returns A promise that resolves to the user object or null if not found.
 * @throws Throws an error if the database query fails.
 */
async function getByEmail(email : string) {
  return User.findOne({ email : email });
}

/**
 * Retrieves a user from the database by their username.
 * @param username - The username of the user to be retrieved.
 * @returns A promise that resolves to the user object or null if not found.
 * @throws Throws an error if the database query fails.
 */
async function getByUsername(username : string) {
  return User.findOne({ username : username });
}

/**
 * Creates a new user in the database.
 * @param user - An object implementing the IUser interface representing the user to be created.
 * @returns A promise that resolves to the created user object.
 * @throws Throws an error if the user creation fails due to validation or database issues.
 */
async function create(user : IUser) {
  return  User.create(user);
}

/**
 * Deletes a user from the database by their unique identifier.
 * @param _id - The ObjectId of the user to be deleted.
 * @returns A promise that resolves to the deleted user document or null if not found.
 * @throws MongooseError if there is an issue with the database operation.
 */
async function remove(_id :  mongoose.Types.ObjectId) {
  return User.findByIdAndDelete(_id);
}

/**
 * Updates a user document in the database by its ID. 
 * If the user does not exist, a new document will be created. 
 * @param _id - The ID of the user to update. 
 * @param user - The user data to update or insert. 
 * @returns A promise that resolves to the updated or created user document. 
 * @throws MongooseError if the update operation fails.
 */
async function update(_id :  mongoose.Types.ObjectId, user : IUser) {
  return User.findOneAndUpdate({ _id: _id }, {$set: user},{upsert: true});
}

export { getByEmail, getByUsername, create, remove ,update};
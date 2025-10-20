import mongoose from "mongoose";
import Auth from "../models/AuthModel";
import { IAuth } from "../interfaces/IAuth";


class AuthRepository{

  constructor(){
      
  }
  /**
     * Retrieves an authentication record by its unique identifier.
     * @param id - The unique identifier of the authentication record (ObjectId).
     * @returns A promise that resolves to the found authentication record or null if not found.
     * @throws Throws an error if the database query fails.
     */
  async findByUserId(id : mongoose.Types.ObjectId) {
      return Auth.findOne({ id : id });
    }
  /**
   * Retrieves an authentication record by the provided token.
   * @param token - The token string used to find the corresponding Auth record.
   * @returns A promise that resolves to the found Auth record or null if not found.
   * @throws Throws an error if the database query fails.
   */
  async findByToken(token : string) {
    return Auth.findOne({ token : token });
  }

  /**
   * Creates a new user in the database.
   * @param user - An object implementing the IUser interface representing the user to be created.
   * @returns A promise that resolves to the created user object.
   * @throws Throws an error if the user creation fails due to validation or database issues.
   */
  async create(auth : IAuth) {
    return  Auth.create(auth);
  }

  /**
   * Updates a user document in the database by its ID. 
   * If the user does not exist, a new document will be created. 
   * @param _id - The ID of the user to update. 
   * @param user - The user data to update or insert. 
   * @returns A promise that resolves to the updated or created user document. 
   * @throws MongooseError if the update operation fails.
   */
  async update(auth : IAuth ) {

      return Auth.updateOne({ id : auth.id}, // Filter
                            {$set: {token : auth.token }}, // Update
                            {upsert: true});
  }

  /**
   * Deletes a user from the database by their unique identifier.
   * @param _id - The ObjectId of the user to be deleted.
   * @returns A promise that resolves to the deleted user document or null if not found.
   * @throws MongooseError if there is an issue with the database operation.
   */
  async remove(auth : IAuth) {
    return Auth.findOneAndDelete(auth);
  }
}

export default AuthRepository;
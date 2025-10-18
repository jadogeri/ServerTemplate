import mongoose from "mongoose";
import User from "../models/UserModel";
import { IUser } from "../interfaces/IUser";


    // src/repositories/user.repository.ts


    // class UserRepository {
    //     async create(userData: IUser): Promise<> {
    //         return UserModel.create(userData);
    //     }

    //     async findAll(): Promise<IUser[]> {
    //         return UserModel.find();
    //     }

    //     async findById(id: string): Promise<IUser | null> {
    //         return UserModel.findById(id);
    //     }

    //     async update(id: string, userData: Partial<User>): Promise<UserDocument | null> {
    //         return UserModel.findByIdAndUpdate(id, userData, { new: true });
    //     }

    //     async delete(id: string): Promise<UserDocument | null> {
    //         return UserModel.findByIdAndDelete(id);
    //     }
    // }

    // export default new UserRepository();

class UserRepository{

    constructor(){
        
    }
    /**
     * Retrieves a user from the database by their email address.
     * @param email - The email address of the user to find.
     * @returns A promise that resolves to the user object or null if not found.
     * @throws Throws an error if the database query fails.
     */
    async getByEmail(email : string) {
    return User.findOne({ email : email });
    }

    /**
     * Retrieves a user from the database by their username.
     * @param username - The username of the user to be retrieved.
     * @returns A promise that resolves to the user object or null if not found.
     * @throws Throws an error if the database query fails.
     */
    async getByUsername(username : string) {
    return User.findOne({ username : username });
    }

    /**
     * Creates a new user in the database.
     * @param user - An object implementing the IUser interface representing the user to be created.
     * @returns A promise that resolves to the created user object.
     * @throws Throws an error if the user creation fails due to validation or database issues.
     */
    async create(user : IUser) {
    return  User.create(user);
    }

    /**
     * Deletes a user from the database by their unique identifier.
     * @param _id - The ObjectId of the user to be deleted.
     * @returns A promise that resolves to the deleted user document or null if not found.
     * @throws MongooseError if there is an issue with the database operation.
     */
    async remove(_id :  mongoose.Types.ObjectId) {
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
    async update(_id :  mongoose.Types.ObjectId, user : IUser) {
    return User.findOneAndUpdate({ _id: _id }, {$set: user},{upsert: true});
    }

}

export default new UserRepository();

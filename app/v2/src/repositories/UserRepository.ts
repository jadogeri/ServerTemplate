import mongoose, { Model } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { UserRegisterRequestDTO } from "../dtos/request/UserRegisterRequestDTO";
import { IUserRepository } from "../interfaces/IUserRepository";

class UserRepository implements IUserRepository{

    private userModel:  Model<IUser>

    constructor(userModel : Model<IUser>){

        this.userModel = userModel;
        
    }
    /**
     * Retrieves a user from the database by their email address.
     * @param email - The email address of the user to find.
     * @returns A promise that resolves to the user object or null if not found.
     * @throws Throws an error if the database query fails.
     */
    async findByEmail(email : string) {

        return this.userModel.findOne({ email : email });
    }

    /**
     * Retrieves a user from the database by their username.
     * @param username - The username of the user to be retrieved.
     * @returns A promise that resolves to the user object or null if not found.
     * @throws Throws an error if the database query fails.
     */
    async findByUsername(username : string) {
        return this.userModel.findOne({ username : username });
    }

    /**
     * Creates a new user in the database.
     * @param user - An object implementing the IUser interface representing the user to be created.
     * @returns A promise that resolves to the created user object.
     * @throws Throws an error if the user creation fails due to validation or database issues.
     */
    async create(user : UserRegisterRequestDTO) {

        return  this.userModel.create(user as IUser);
    }

    /**
     * Deletes a user from the database by their unique identifier.
     * @param _id - The ObjectId of the user to be deleted.
     * @returns A promise that resolves to the deleted user document or null if not found.
     * @throws MongooseError if there is an issue with the database operation.
     */
    async delete(_id :  mongoose.Types.ObjectId) {
        return this.userModel.findByIdAndDelete(_id);
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
        return this.userModel.findOneAndUpdate({ _id: _id }, {$set: user},{upsert: true});
    }

        /**
     * Deletes a user from the database by their unique identifier.
     * @param _id - The ObjectId of the user to be deleted.
     * @returns A promise that resolves to the deleted user document or null if not found.
     * @throws MongooseError if there is an issue with the database operation.
     */
    async remove(_id :  mongoose.Types.ObjectId) {
    return this.userModel.findByIdAndDelete(_id);
    }

}

export default UserRepository;

import mongoose from "mongoose";
import { UserRegisterRequestDTO } from "../dtos/request/UserRegisterRequestDTO";
import { IUser } from "./IUser";

export interface IUserRepository {

    findByEmail(email : string): Promise<any | null>

    findByUsername(username : string): Promise<any | null>;

    create(user : UserRegisterRequestDTO): Promise<any | null>;

    delete(_id :  mongoose.Types.ObjectId): Promise<any | null>;

    update(_id :  mongoose.Types.ObjectId, user : IUser) : Promise<any | null>;

    remove(_id :  mongoose.Types.ObjectId): Promise<any | null>;

}
import mongoose, { Date } from "mongoose";

export interface IUser  {
    username?: string;
    email?: string;
    password? : string,
    phone? : string
    isEnabled? : boolean,
    failedLogins? : number,
    createdAt?: Date,
    updatedAt?: Date,
    _id?: mongoose.Types.ObjectId

  

}

import mongoose from "mongoose";

export interface IAuthService {

    findByUserId(userID: mongoose.Types.ObjectId): Promise<any | null>;
    create(userID: mongoose.Types.ObjectId, accessToken: string): Promise<any | null>;
    update(userID: mongoose.Types.ObjectId, accessToken: string): Promise<any | null>;
    findByToken(token: string): Promise<any | null>;
    remove(token: string): Promise<any | null>;
    removeByUserID(userID: mongoose.Types.ObjectId): Promise<any | null>;  
}
  
  
  
 
import mongoose from "mongoose";
import { IAuth } from "./IAuth";

export interface IAuthRepository {

    findByUserId(id : mongoose.Types.ObjectId): Promise<any | null>;

    findByToken(token : string) : Promise<any | null>;

    create(auth : IAuth): Promise<any | null>;

    update(auth : IAuth ): Promise<any | null>;

    remove(auth : IAuth): Promise<any | null>
  
}
  
  
  
 
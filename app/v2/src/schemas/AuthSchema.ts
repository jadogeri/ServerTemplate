
import mongoose, { Schema, Model} from 'mongoose';
import { IAuth } from "../interfaces/IAuth";

export class AuthSchema {

  private authSchema : Schema ;

  constructor(){
    this.authSchema  = new Schema<IAuth>({

      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      token: {
        type: String,
        required: false,
      },

    },
    {
      timestamps: true,
    }
  );}

  public getInstance(): Schema<IAuth> {
    return this.authSchema;
  }
}

  

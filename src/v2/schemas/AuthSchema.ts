
import mongoose, { Schema, Model} from 'mongoose';
import { IAuth } from "../interfaces/IAuth";


// export class UserSchema {

//     private userSchema : Schema ;

//     constructor(){
//         this.userSchema  = new Schema<IUser>({

//             username: {
//                 type: String,
//                 required: [true, "Please add the user name"],
//                 unique: [true, "username already taken"],
//                 trim: true,
//             },
//             email: {
//                 type: String,
//                 required: [true, "Please add the user email address"],
//                 unique: [true, "Email address already taken"],
//                 //lowercase: true,
//                 trim: true,
//             },
//             password: {
//                 type: String,
//                 required: [true, "Please add the user password"],
//                 trim: true,
//             },
//             phone: {
//                 type: String,
//                 required: [false, "Please add the user phone number"],
//             },
//             isEnabled: {
//                 type : Boolean,
//                 required : false,
//                 default : true

//             },
//             failedLogins :{
//                 type: Number,
//                 required : false,
//                 default : 0,
//                 min: [0,"Cannot have login attempts less than zero"],
//                 max: [0,"Cannot have login attempts greater than 3"]

//             }
//             },
//             {
//                 timestamps: true,
//             }
//         );

//     }

//     public getInstance(): Schema<IUser> {
//         return this.userSchema;
//     }
    
// }


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

  

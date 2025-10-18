
import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from "../interfaces/IUser";

const userSchema : Schema = new Schema<IUser>({

  username: {
    type: String,
    required: [true, "Please add the user name"],
    unique: [true, "username already taken"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add the user email address"],
    unique: [true, "Email address already taken"],
    //lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please add the user password"],
    trim: true,
  },
  phone: {
    type: String,
    required: [false, "Please add the user phone number"],
  },
  isEnabled: {
    type : Boolean,
    required : false,
    default : true

  },
  failedLogins :{
    type: Number,
    required : false,
    default : 0,
    min: [0,"Cannot have login attempts less than zero"],
    max: [0,"Cannot have login attempts greater than 3"]

  }
},
  {
    timestamps: true,
  });


  const User: Model<IUser>  = mongoose.model<IUser>("User", userSchema);

export default User;


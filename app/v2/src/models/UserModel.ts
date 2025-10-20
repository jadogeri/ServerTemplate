import mongoose, { Model } from 'mongoose';
import { UserSchema } from '../schemas/UserSchema';
import { IUser } from '../interfaces/IUser';

class UserModel{

    private schema: UserSchema;

    constructor(){
        this.schema = new UserSchema();
    }

    public getInstance():  Model<IUser>{

        const userSchema = this.schema.getInstance();   
        
        const User: Model<IUser>  = mongoose.model<IUser>("User", userSchema);

        return User;
    }
}

const User = new UserModel().getInstance();

export default User;
import mongoose, { Model } from 'mongoose';
import { AuthSchema } from '../schemas/AuthSchema';
import { IAuth } from '../interfaces/IAuth';


class AuthModel{

  private schema: AuthSchema;

  constructor(){
      this.schema = new AuthSchema();
  }

  public getInstance():  Model<IAuth>{

    const authSchema = this.schema.getInstance();   
    
    const Auth: Model<IAuth>  = mongoose.model<IAuth>("Auth", authSchema);

    return Auth;
  }
}

const Auth = new AuthModel().getInstance();

export default Auth;
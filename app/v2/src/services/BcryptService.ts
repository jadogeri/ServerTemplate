import { generateRandomUUID } from "../utils/generateRandonUUID";
import * as bcrypt from "bcrypt";


 
class BcryptService {

  private size : number;    
  private uuid: string | null;

  constructor(){
    this.size = parseInt(process.env.NANOID_SIZE as string);
    this.uuid = null;
  }   
  
  public updateUUID(){
    // Using the alphanumeric dictionary
    this.uuid = generateRandomUUID(this.size)  
    console.log("uuid === ", this.uuid);

  }

  public getUUID(): string{
    if(this.uuid === null){
      this.updateUUID();
    }
    return this.uuid as string;
  }

  async getHashedPassword(): Promise<string>{
    //generate new hashed password
    this.updateUUID();
    //hash generated password
    const hashedPassword : string = await bcrypt.hash(this.getUUID() as string , parseInt(process.env.BCRYPT_SALT_ROUNDS as string));
    console.log("Hashed Password: ", hashedPassword);
    return hashedPassword;

  }

}    

export default BcryptService;


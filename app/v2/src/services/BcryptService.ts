import { IBcryptService } from "../interfaces/IBcryptService";
import { generateRandomUUID } from "../utils/generateRandonUUID";
import * as bcrypt from "bcrypt";


 
class BcryptService implements IBcryptService{

  private size : number;    
  private uuid: string | null;

  constructor(){
    this.size = parseInt(process.env.NANOID_SIZE as string);
    this.uuid = null;
  }   
  
/**
     * Generates a new random UUID using the specified size and updates the instance's uuid property.
     * @param {void} No parameters are accepted.
     * @returns {void} This function does not return a value.
     * @throws {Error} Throws an error if UUID generation fails.
     */
  public updateUUID(){
    // Using the alphanumeric dictionary
    this.uuid = generateRandomUUID(this.size)  

  }

/**
   * Retrieves the UUID of the instance. If the UUID is null, it updates the UUID before returning.
   * @returns {string} The UUID of the instance.
   * @throws {Error} Throws an error if UUID generation fails during update.
   */
  public getUUID(): string{
    if(this.uuid === null){
      this.updateUUID();
    }
    return this.uuid as string;
  }

/**
   * Generates a new hashed password using a UUID and bcrypt.
   * @returns {Promise<string>} The hashed password as a string.
   * @throws {Error} If hashing fails due to bcrypt issues.
   */
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


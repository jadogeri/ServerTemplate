    // src/services/user.service.ts
    import mongoose from 'mongoose';
import { UserRegisterRequestDTO } from '../dtos/request/UserRegisterRequestDTO';
import { UserRegisterResponseDTO } from '../dtos/response/UserRegisterResponseDTO';
import { ErrorResponse } from '../entities/ErrorResponse';
import { IUser } from '../interfaces/IUser';
import UserRepository from '../repositories/UserRepository';
import {hash} from "bcrypt";
import { UserLoginResponseDTO } from '../dtos/response/UserLoginResponseDTO';
import { UserLoginRequestDTO } from '../dtos/request/UserLoginRequestDTO';
import * as bcrypt from "bcrypt";
import * as  jwt from "jsonwebtoken";
import { IAuth } from '../interfaces/IAuth';
import AuthRepository from '../repositories/AuthRepository';
import { UserForgotRequestDTO } from '../dtos/request/UserForgotRequestDTO';
import { UserForgotResponseDTO } from '../dtos/response/UserForgotResponseDTO';
import BcryptService from './BcryptService';
import EmailService from './EmailService';
import { Recipient } from '../types/Recipient';
import { IJwtPayload } from '../interfaces/IJWTPayload';
import { UserLogoutResponseDTO } from '../dtos/response/UserLogoutResponseDTO';




// import { Recipient } from "../../types/Recipient";
// import { sendEmail } from "../../tools/mail/utils/sendEmail";
// import { sendSms } from "../../tools/phone/sendSms";
 
    class AuthService {

        private authRepository: AuthRepository;
        
        constructor(authRepository: AuthRepository){

            this.authRepository = authRepository
        }

    async findByUserId(userID: mongoose.Types.ObjectId): Promise<IAuth| null>{

      return await this.authRepository.findByUserId(userID);
    }

    async create(userID: mongoose.Types.ObjectId, accessToken: string){
      const auth : IAuth = {
        id : userID,
        token : accessToken
      }
      return await this.authRepository.create(auth);

    }

    async update(userID: mongoose.Types.ObjectId, accessToken: string){
      const auth : IAuth = {
        id : userID,
        token : accessToken
      }
      return await this.authRepository.update(auth);

    }

    async findByToken(token: string){

      return await this.authRepository.findByToken(token)
    }

    async remove(token: string){
      const auth : IAuth = {
        token : token
      }

      return await this.authRepository.remove(auth)
    }



    }

    
    export default AuthService;

/**
 * 
 


export const forgotUser = asyncHandler(async (req: Request, res : Response) => {


  }else{
    //generate unique password
    const size : number = parseInt(process.env.NANOID_SIZE as string);
    
    // Using the alphanumeric dictionary
    const uuid = generateRandomUUID(size)  

    console.log("uuid === ", uuid);
    //hash generated password
    const hashedPassword : string = await bcrypt.hash(uuid , parseInt(process.env.BCRYPT_SALT_ROUNDS as string));
    console.log("Hashed Password: ", hashedPassword);
    //store generated password in database and unlock account
    const updatedUser : IUser = {
      password : hashedPassword,
      failedLogins : 0,
      isEnabled : true
    }
    await userService.update(user._id, updatedUser)
    //update user password with uuid
    .then(()=>{
      let recipient : Recipient ={
        company : process.env.COMPANY as string,
        username : user.username,
        email : user.email,
        password : uuid
      }
      sendEmail("forgot-password",recipient)
    res.status(200).json({ password: uuid });

    })
  }
});


























































   .then((user: IUser)=>{
 
     let recipient : Recipient= {username : user.username, email: user.email, company : company}  
 try{  
    sendEmail('register-account', recipient);
    //TODO ADD PHONE SENDING
   //  sendSms("YOUR TWILIO PHONE NUMBER",recipient)
   console.log(`User created ${JSON.stringify(user)}`);
   if (user) {
     //send response 
     res.status(201).json(user);
   }else{
     res.status(400).json({ message: "something went wrong" });
   }
 
 }catch(e){
   console.log(e)
 */
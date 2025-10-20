/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 09-FEB-2025
 *
 */
import asyncHandler from '../../v2/utils/asyncHandler';
import { Response, Request } from 'express';
import { errorBroadcaster } from "../utils/errorBroadcaster";
import { isValidEmail, isValidPassword, isValidUsername, isValidatePhoneNumber } from "../utils/inputValidation";


import UserService from '../services/UserService';
import { UserRegisterRequestDTO } from '../dtos/request/UserRegisterRequestDTO';
import { UserRegisterResponseDTO } from '../dtos/response/UserRegisterResponseDTO';
import { ErrorResponse } from '../entities/ErrorResponse';
import EmailService from '../services/EmailService';
import { Recipient } from '../types/Recipient';
import { UserLoginRequestDTO } from '../dtos/request/UserLoginRequestDTO';
import { UserLoginResponseDTO } from '../dtos/response/UserLoginResponseDTO';


/**
*@desc Current user info
*@route POST /api/users/current
*@access private
*/

class UserController{

  private userService : UserService;
  private emailService : EmailService;

  constructor(userService: UserService, emailService : EmailService){
    this.userService = userService;
    this.emailService = emailService;
  }

  registerUser = asyncHandler(async (req: Request<{}, {}, UserRegisterRequestDTO>, res: Response) : Promise<void> => {

    const userRequest : UserRegisterRequestDTO = req.body 
    console.log(userRequest)
    const { username, email, password, phone } = userRequest;

    if (!username || !email || !password) {
      errorBroadcaster(res,400,"All fields are mandatory!");
    }
    if(!isValidEmail(email as string)){
      errorBroadcaster(res,400,"not a  valid email");
    }
    if(!isValidUsername(username as string)){
      errorBroadcaster(res,400,"not a valid username");

    }
    if(!isValidPassword(password as string)){
      errorBroadcaster(res,400,"not a valid password")
    }  
  //if phone number is provided check if string is a valid phone number
    if(phone){

      if(!isValidatePhoneNumber(phone )){
        errorBroadcaster(res,400,"not a valid phone number")
      }  
    }    
   
    //calling service
    const userResponse : ErrorResponse | UserRegisterResponseDTO = await this.userService.registerUser(userRequest);    

    console.log("user response",userResponse)
    if(userResponse instanceof ErrorResponse){
      errorBroadcaster(res, userResponse.getCode(), userResponse.getMessage())
    }else{
      // SEND EMAIL
      let recipient : Recipient= {username : userResponse.username, email: userResponse.email}  
      this.emailService.sendEmail('register-account', recipient);

      // SEND RESPONSE  
      res.status(201).send(userResponse);
    }

  });

  loginUser = asyncHandler(async (req: Request<{}, {}, UserLoginRequestDTO>, res: Response)  => {
    const userRequest : UserLoginRequestDTO = req.body 
    console.log(userRequest)
    const { email, password } = userRequest;
    console.log(email,password)
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    if(!isValidEmail(email)){
      errorBroadcaster(res,400,"not a valid standard email address")
    }

    //calling service
    const userResponse : ErrorResponse | UserLoginResponseDTO = await this.userService.loginUser(userRequest);  
    
    if(userResponse instanceof ErrorResponse){
      //IF ERROR MESSAGE CONTAINS 'LOCKED' THEN SEND EMAIL
      if(userResponse.getMessage().toUpperCase().includes("LOCKED") && userResponse.getMessage().toUpperCase().includes("FORGOT")){
        // SEND EMAIL
        let recipient : Recipient= {username : userResponse.getUsername(), email: userResponse.getEmail()}  
        this.emailService.sendEmail("locked-account",recipient ); 
      }

      errorBroadcaster(res, userResponse.getCode(), userResponse.getMessage())
    }else{

      // SEND RESPONSE  
      res.status(200).send(userResponse);
    }    

  });
    





























  currentUser = asyncHandler(async (req: Request, res : Response) => {  

    this.userService.currentUser();

    res.status(200).json({message: "register user"});
  });

  // loginUser = asyncHandler(async (req : any, res: Response) => {

  //   this.userService.loginUser();

  //   res.status(200).json({message: "login user"});
  // });

  logoutUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.logoutUser();

    res.status(200).json({message: "logout user"});
  });

  forgotUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.forgotUser();

    res.status(200).json({message: "forgot user"});
  });

  resetUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.resetUser();

    res.status(200).json({message: "reset user"});
  });

  deactivateUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.deactivateUser();

    res.status(200).json({message: "deactivate user"});
  });

}

export default UserController;

/**
 * 


const asyncHandler = require("express-async-handler");
import {hash} from "bcrypt";
import { Response, Request } from 'express';
import { IUser } from '../../interfaces/IUser';
import * as userService from "../../services/userService"
import { errorBroadcaster } from "../../utils/errorBroadcaster";
import { isValidEmail, isValidPassword, isValidUsername, isValidatePhoneNumber } from "../../utils/inputValidation";

import { Recipient } from "../../types/Recipient";
import { sendEmail } from "../../tools/mail/utils/sendEmail";
import { sendSms } from "../../tools/phone/sendSms";

let company = process.env.COMPANY


export const registerUser = asyncHandler(async (req: Request, res : Response) => {  
    
  const { username, email, password, phone } : IUser = req.body;
  
  if (!username || !email || !password) {
    errorBroadcaster(res,400,"All fields are mandatory!")
  }
  if(!isValidEmail(email as string)){
    errorBroadcaster(res,553,"not a  valid email")

  }
  if(!isValidUsername(username as string)){
    errorBroadcaster(res,400,"not a valid username")

  }
  if(!isValidPassword(password as string)){
    errorBroadcaster(res,400,"not a valid password")
  }  
//if phone number is provided check if string is a valid phone number
  if(phone){
    if(!isValidatePhoneNumber(phone )){
        errorBroadcaster(res,400,"not a valid phone number")
    }  
  }
  
  const userByEmailAvailable  = await userService.getByEmail(email as string);
  if (userByEmailAvailable) {
    errorBroadcaster(res,409,"User already registered!");
  }
  const userByUsernameAvailable  = await userService.getByUsername(username as string);
  if (userByUsernameAvailable) {
    errorBroadcaster(res,409,"Username already taken!");
  }




























  
  //Hash password
  const hashedPassword : string = await hash(password as string, parseInt(process.env.BCRYPT_SALT_ROUNDS as string));
  console.log("Hashed Password: ", hashedPassword);
  const unregisteredUser : IUser = req.body 
  unregisteredUser.password = hashedPassword;
  //const user = await userService.create(unregisteredUser)
  await userService.create(unregisteredUser)  
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
}
   })  
  
  })
 */
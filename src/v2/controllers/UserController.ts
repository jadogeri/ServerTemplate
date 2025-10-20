/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 09-FEB-2025
 *
 */
const asyncHandler = require("express-async-handler");
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
import { UserForgotRequestDTO } from '../dtos/request/UserForgotRequestDTO';
import { UserForgotResponseDTO } from '../dtos/response/UserForgotResponseDTO';
import { IJwtPayload } from '../interfaces/IJWTPayload';
import { UserLogoutResponseDTO } from '../dtos/response/UserLogoutResponseDTO';


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

  loginUser = asyncHandler(async (req: Request<{}, {}, UserLoginRequestDTO>, res: Response): Promise<void>  => {
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
    



  forgotUser = asyncHandler(async (req: Request<{}, {}, UserRegisterRequestDTO>, res: Response) : Promise<void> => {
    
    const userRequest : UserForgotRequestDTO = req.body 
    console.log(userRequest)
    const { email } = userRequest;
    console.log(email)

    if(!email){
      errorBroadcaster(res,400,"Email is mandatory!");
    }
    if(!isValidEmail(email)){
      errorBroadcaster(res,400,"not a  valid email")
    }

    //calling service
    const userResponse : ErrorResponse | UserForgotResponseDTO = await this.userService.forgotUser(userRequest);  
    if(userResponse instanceof ErrorResponse){
      //IF ERROR MESSAGE THEN SEND RESPONSE
      errorBroadcaster(res, userResponse.getCode(), userResponse.getMessage())
    }else{
    // SEND RESPONSE  
      res.status(200).send(userResponse);
    }    
    
  });  

  
  currentUser = asyncHandler(async (req : IJwtPayload , res: Response) => {
    
    res.status(200).json(req.user);

  });

  logoutUser = asyncHandler(async (req: Request<{}, {}, IJwtPayload>, res: Response) : Promise<void> => {
   
  const userRequest = req as IJwtPayload;  
  const token = userRequest.token as string
  console.log("token==================", token)
  if(!token){ 
    errorBroadcaster(res,400,"field token is mandatory");
  } 
    //calling service
  const userResponse : ErrorResponse | UserLogoutResponseDTO = await this.userService.logoutUser(userRequest);  
  if(userResponse instanceof ErrorResponse){
    //IF ERROR MESSAGE THEN SEND RESPONSE
    errorBroadcaster(res, userResponse.getCode(), userResponse.getMessage())
  }else{
  // SEND RESPONSE  
    res.status(200).send(userResponse);    }    
  
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

import { Response, Request } from 'express';
import { IUserForgot } from "../../interfaces/IUserForgot";
import * as userService from "../../services/userService"
import { errorBroadcaster } from "../../utils/errorBroadcaster";
import * as bcrypt from "bcrypt"
import { isValidEmail } from '../../utils/inputValidation';
import { IUser } from '../../interfaces/IUser';
const asyncHandler = require("express-async-handler");
import { generateRandomUUID } from '../../utils/generateRandonUUID';
import { Recipient } from '../../types/Recipient';
import { sendEmail } from '../../tools/mail/utils/sendEmail';


export const forgotUser = asyncHandler(async (req: Request, res : Response) => {

  const { email} : IUserForgot = req.body;
  if (!email ) {
    res.status(400);
    throw new Error("Email is mandatory!");
  }
  if(!isValidEmail(email)){
    errorBroadcaster(res,400,"not a  valid email")
  }

  const user  = await userService.getByEmail(email);
  if (!user) {
    errorBroadcaster(res,400,`Invalid Email ${email}`);
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
 */
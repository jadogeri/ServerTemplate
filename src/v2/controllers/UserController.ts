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
import { UserLoginRequestDTO } from '../dtos/request/UserLoginRequestDTO';
import { UserLoginResponseDTO } from '../dtos/response/UserLoginResponseDTO';
import { UserForgotRequestDTO } from '../dtos/request/UserForgotRequestDTO';
import { UserForgotResponseDTO } from '../dtos/response/UserForgotResponseDTO';
import { IJwtPayload } from '../interfaces/IJWTPayload';
import { UserLogoutResponseDTO } from '../dtos/response/UserLogoutResponseDTO';
import { UserDeactivateRequestDTO } from '../dtos/request/UserDeactivateRequestDTO';
import { UserDeactivateResponseDTO } from '../dtos/response/UserDeactivateResponseDTO';
import { UserResetRequestDTO } from '../dtos/request/UserResetRequestDTO';
import { UserResetResponseDTO } from '../dtos/response/UserResetResponseDTO';

/**
*@desc Current user info
*@route POST /api/users/current
*@access private
*/

class UserController{

  private userService : UserService;

  constructor(userService: UserService){

    this.userService = userService;
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
    res.status(200).send(userResponse);   
   }    
  
});



  resetUser = asyncHandler(async (req: Request<{}, {}, UserResetRequestDTO>, res: Response) : Promise<void> => {
  const userRequest : UserResetRequestDTO  = req.body
  const { email, oldPassword, newPassword, confirmNewPassword } = userRequest;
    console.log(email ,oldPassword, newPassword, confirmNewPassword)
    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      res.status(400);
      throw new Error("All fields are mandatory!");

    }
    if(!isValidEmail(email as string)){
      errorBroadcaster(res,400,"not a  valid email")
  
    }
    if(!isValidPassword(newPassword as string)){
      errorBroadcaster(res,400,"not a valid new password")
    }  
    if(newPassword !== confirmNewPassword){
      errorBroadcaster(res,400,"passwords do not match");
    }

    //calling service
    const userResponse : ErrorResponse | UserResetResponseDTO = await this.userService.resetUser(userRequest);
    
    if(userResponse instanceof ErrorResponse){
    //IF ERROR MESSAGE THEN SEND RESPONSE
      errorBroadcaster(res, userResponse.getCode(), userResponse.getMessage())
    }else{
    // SEND RESPONSE  
      res.status(200).send(userResponse);   
    }    

  });

  deactivateUser = asyncHandler(async (req: Request<{}, {}, UserDeactivateRequestDTO>, res: Response) : Promise<void> => {

  const userRequest : UserDeactivateRequestDTO  = req.body
  const { email, password, confirm} : UserDeactivateRequestDTO  = userRequest
  if (!email || !password || confirm == undefined) {
    console.log(email,password,confirm)

    errorBroadcaster(res,400,"All fields are mandatory!");
  }
  if(!isValidEmail(email )){
    errorBroadcaster(res,400,"not a  valid email");

  }

  if(confirm!== true){
    errorBroadcaster(res,400,"confirm must be true");

  }

      //calling service
  const userResponse : ErrorResponse | UserDeactivateResponseDTO = await this.userService.deactivateUser(userRequest); 
    if(userResponse instanceof ErrorResponse){
      //IF ERROR MESSAGE THEN SEND RESPONSE
      errorBroadcaster(res, userResponse.getCode(), userResponse.getMessage())
    }else{
    // SEND RESPONSE  
      res.status(200).send(userResponse);
    }    
  });

}

export default UserController;

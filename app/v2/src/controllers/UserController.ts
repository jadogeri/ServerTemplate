/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 09-FEB-2025
 *
 */
const asyncHandler = require("express-async-handler");
import { Response, Request } from 'express';
import { errorBroadcaster } from "../utils/errorBroadcaster";
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
import { ValidationResponse } from '../entities/ValidationResponse';
import { IUserService } from '../interfaces/IUserService';
import { ICredentialValidatorService } from '../interfaces/ICredentialValidatorService';
import { IUserController } from '../interfaces/IUserController';

/**
*@desc Current user info
*@route POST /api/users/current
*@access private
*/

class UserController implements IUserController{

  private userService : IUserService;
  private credentialValidatorService: ICredentialValidatorService

  constructor(userService: IUserService, credentialValidatorService: ICredentialValidatorService){

    this.userService = userService;
    this.credentialValidatorService = credentialValidatorService;
  }

  registerUser = asyncHandler(async (req: Request<{}, {}, UserRegisterRequestDTO>, res: Response) : Promise<void> => {

    const userRequest : UserRegisterRequestDTO = req.body 
    // calling validation service
    const validation : ValidationResponse = this.credentialValidatorService.validateRegistration(userRequest);
    if(!validation.isValid()){
      const errorResponse : ErrorResponse = validation.getErrorResponse() as ErrorResponse;
      errorBroadcaster(res,errorResponse.getCode(), errorResponse.getMessage())
    }   
    //calling user service
    const userResponse : ErrorResponse | UserRegisterResponseDTO = await this.userService.registerUser(userRequest);    

    if(userResponse instanceof ErrorResponse){
      errorBroadcaster(res, userResponse.getCode(), userResponse.getMessage())
    }else{
      // SEND RESPONSE  
      res.status(201).send(userResponse);
    }
  });

  loginUser = asyncHandler(async (req: Request<{}, {}, UserLoginRequestDTO>, res: Response): Promise<void>  => {
    const userRequest : UserLoginRequestDTO = req.body 

    // calling validation service
    const validation : ValidationResponse = this.credentialValidatorService.validateLogin(userRequest);
    if(!validation.isValid()){
      const errorResponse : ErrorResponse = validation.getErrorResponse() as ErrorResponse;
      errorBroadcaster(res,errorResponse.getCode(), errorResponse.getMessage())
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
  
  forgotUser = asyncHandler(async (req: Request<{}, {}, UserForgotRequestDTO>, res: Response) : Promise<void> => {
    
    const userRequest : UserForgotRequestDTO = req.body 

    // calling validation service
    const validation : ValidationResponse = this.credentialValidatorService.validateForgotPassword(userRequest);
    if(!validation.isValid()){
      const errorResponse : ErrorResponse = validation.getErrorResponse() as ErrorResponse;
      errorBroadcaster(res,errorResponse.getCode(), errorResponse.getMessage())
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
   
    const userRequest : IJwtPayload = req as IJwtPayload
      // calling validation service
    const validation : ValidationResponse = this.credentialValidatorService.validateLogout(userRequest);
    if(!validation.isValid()){
      const errorResponse : ErrorResponse = validation.getErrorResponse() as ErrorResponse;
      errorBroadcaster(res,errorResponse.getCode(), errorResponse.getMessage())
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
    // calling validation service
    const validation : ValidationResponse = this.credentialValidatorService.validateResetPassword(userRequest);
    if(!validation.isValid()){
      const errorResponse : ErrorResponse = validation.getErrorResponse() as ErrorResponse;
      errorBroadcaster(res,errorResponse.getCode(), errorResponse.getMessage())
    }
    //calling user service
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
     // calling validation service
    const validation : ValidationResponse = this.credentialValidatorService.validateDeactivate(userRequest);
    if(!validation.isValid()){
      const errorResponse : ErrorResponse = validation.getErrorResponse() as ErrorResponse;
      errorBroadcaster(res,errorResponse.getCode(), errorResponse.getMessage())
    }  
    //calling  user service
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

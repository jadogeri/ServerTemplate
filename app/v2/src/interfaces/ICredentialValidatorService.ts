import { UserDeactivateRequestDTO } from "../dtos/request/UserDeactivateRequestDTO";
import { UserForgotRequestDTO } from "../dtos/request/UserForgotRequestDTO";
import { UserLoginRequestDTO } from "../dtos/request/UserLoginRequestDTO";
import { UserRegisterRequestDTO } from "../dtos/request/UserRegisterRequestDTO";
import { UserResetRequestDTO } from "../dtos/request/UserResetRequestDTO";
import { ValidationResponse } from "../entities/ValidationResponse";
import { IJwtPayload } from "./IJWTPayload";

export interface ICredentialValidatorService {

  validateRegistration(userRequest: UserRegisterRequestDTO): ValidationResponse;

  validateLogin(userRequest: UserLoginRequestDTO): ValidationResponse;

  validateForgotPassword(userRequest: UserForgotRequestDTO): ValidationResponse;

  validateLogout(userRequest: IJwtPayload): ValidationResponse;

  validateResetPassword(userRequest: UserResetRequestDTO): ValidationResponse;
  
  validateDeactivate(userRequest: UserDeactivateRequestDTO): ValidationResponse;

}
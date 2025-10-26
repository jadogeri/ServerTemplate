import { UserDeactivateRequestDTO } from "../dtos/request/UserDeactivateRequestDTO";
import { UserForgotRequestDTO } from "../dtos/request/UserForgotRequestDTO";
import { UserLoginRequestDTO } from "../dtos/request/UserLoginRequestDTO";
import { UserRegisterRequestDTO } from "../dtos/request/UserRegisterRequestDTO";
import { UserResetRequestDTO } from "../dtos/request/UserResetRequestDTO";
import { UserDeactivateResponseDTO } from "../dtos/response/UserDeactivateResponseDTO";
import { UserForgotResponseDTO } from "../dtos/response/UserForgotResponseDTO";
import { UserLoginResponseDTO } from "../dtos/response/UserLoginResponseDTO";
import { UserLogoutResponseDTO } from "../dtos/response/UserLogoutResponseDTO";
import { UserRegisterResponseDTO } from "../dtos/response/UserRegisterResponseDTO";
import { UserResetResponseDTO } from "../dtos/response/UserResetResponseDTO";
import { ErrorResponse } from "../entities/ErrorResponse";
import { IJwtPayload } from "./IJWTPayload";

       

export interface IUserService {

    registerUser(reqUser: UserRegisterRequestDTO): Promise<UserRegisterResponseDTO | ErrorResponse> ;
    
    loginUser(reqUser: UserLoginRequestDTO): Promise<UserLoginResponseDTO | ErrorResponse>;

    forgotUser(reqUser: UserForgotRequestDTO): Promise<UserForgotResponseDTO | ErrorResponse>;

    logoutUser(jwtPayload: IJwtPayload): Promise<UserLogoutResponseDTO | ErrorResponse> ;

    deactivateUser(reqUser: UserDeactivateRequestDTO): Promise<UserDeactivateResponseDTO | ErrorResponse>;

    resetUser(reqUser: UserResetRequestDTO): Promise<UserResetResponseDTO | ErrorResponse>;
        
}
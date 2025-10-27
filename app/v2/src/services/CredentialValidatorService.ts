import { UserDeactivateRequestDTO } from "../dtos/request/UserDeactivateRequestDTO";
import { UserForgotRequestDTO } from "../dtos/request/UserForgotRequestDTO";
import { UserLoginRequestDTO } from "../dtos/request/UserLoginRequestDTO";
import { UserRegisterRequestDTO } from "../dtos/request/UserRegisterRequestDTO";
import { UserResetRequestDTO } from "../dtos/request/UserResetRequestDTO";
import { ErrorResponse } from "../entities/ErrorResponse";
import { ValidationResponse } from "../entities/ValidationResponse";
import { ICredentialValidatorService } from "../interfaces/ICredentialValidatorService";
import { IJwtPayload } from "../interfaces/IJWTPayload";
import {isValidEmail, isValidPassword, isValidUsername, isValidatePhoneNumber} from "../utils/inputValidation"

class CredentialValidatorService implements ICredentialValidatorService{

    constructor(){

    }

    validateRegistration(userRequest: UserRegisterRequestDTO): ValidationResponse{
        const { username, email, password, phone } = userRequest;

        if (!username || !email || !password) {
            return new ValidationResponse(false, new ErrorResponse(400,"All fields are mandatory!"));
        }
        if(!isValidEmail(email as string)){
            return new ValidationResponse(false, new ErrorResponse(400,"not a  valid email"));
        }
        if(!isValidUsername(username as string)){
            return new ValidationResponse(false, new ErrorResponse(400,"not a valid username"));

        }
        if(!isValidPassword(password as string)){
            return new ValidationResponse(false, new ErrorResponse(400,"not a valid password"));
        }  
        //if phone number is provided check if string is a valid phone number
        if(phone){

            if(!isValidatePhoneNumber(phone )){
                return new ValidationResponse(false, new ErrorResponse(400,"not a valid phone number"));
            }  
        }    

        return new ValidationResponse(true);

    }

    validateLogin(userRequest: UserLoginRequestDTO): ValidationResponse{
        const { email, password  } = userRequest;
        console.log(userRequest)
        if (!email || !password) {
            return new ValidationResponse(false, new ErrorResponse(400,"All fields are mandatory!"));
        }

        if(!isValidEmail(email)){
            return new ValidationResponse(false, new ErrorResponse(400,"not a valid standard email address"));
        }

        return new ValidationResponse(true);

    }

    validateForgotPassword(userRequest: UserForgotRequestDTO): ValidationResponse{
        console.log(userRequest)
        const { email } = userRequest;
        console.log(email)

        if(!email){
            return new ValidationResponse(false, new ErrorResponse(400,"Email is mandatory!"));
        }
        if(!isValidEmail(email)){
            return new ValidationResponse(false, new ErrorResponse(400,"not a  valid email"));
        }
        return new ValidationResponse(true);


    }

    validateLogout(userRequest: IJwtPayload): ValidationResponse{
        console.log(userRequest)
        const token = userRequest.token as string
        console.log("token==================", token)
        if(!token){ 
            return new ValidationResponse(false, new ErrorResponse(400,"field token is mandatory"));
        } 
        return new ValidationResponse(true);
    }

    validateResetPassword(userRequest: UserResetRequestDTO): ValidationResponse{
        const { email, oldPassword, newPassword, confirmNewPassword } = userRequest;
        console.log(email ,oldPassword, newPassword, confirmNewPassword)
        if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
          return new ValidationResponse(false, new ErrorResponse(400 ,"All fields are mandatory!"));
    
        }
        if(!isValidEmail(email as string)){
          return new ValidationResponse(false, new ErrorResponse(400,"not a  valid email"));
      
        }
        if(!isValidPassword(newPassword as string)){
          return new ValidationResponse(false, new ErrorResponse(400,"not a valid new password"));
        }  
        if(newPassword !== confirmNewPassword){
          return new ValidationResponse(false, new ErrorResponse(400,"passwords do not match"));
        }
        return new ValidationResponse(true);    

    }
    validateDeactivate(userRequest: UserDeactivateRequestDTO): ValidationResponse{
        const { email, password, confirm} : UserDeactivateRequestDTO  = userRequest
        if (!email || !password || confirm == undefined) {
            console.log(email,password,confirm)
            return new ValidationResponse(false, new ErrorResponse(400,"All fields are mandatory!"));
        }
        if(!isValidEmail(email )){
            return new ValidationResponse(false, new ErrorResponse(400,"not a  valid email"));

        }

        if(confirm!== true){
            return new ValidationResponse(false, new ErrorResponse(400,"confirm must be true"));

        }
        return new ValidationResponse(true);    

    }

    
}

export default CredentialValidatorService;
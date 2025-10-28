    // src/services/user.service.ts
    import mongoose from 'mongoose';
import { UserRegisterRequestDTO } from '../dtos/request/UserRegisterRequestDTO';
import { UserRegisterResponseDTO } from '../dtos/response/UserRegisterResponseDTO';
import { ErrorResponse } from '../entities/ErrorResponse';
import { IUser } from '../interfaces/IUser';
import {hash} from "bcrypt";
import { UserLoginResponseDTO } from '../dtos/response/UserLoginResponseDTO';
import { UserLoginRequestDTO } from '../dtos/request/UserLoginRequestDTO';
import * as bcrypt from "bcrypt";
import * as  jwt from "jsonwebtoken";
import { IAuth } from '../interfaces/IAuth';
import { UserForgotRequestDTO } from '../dtos/request/UserForgotRequestDTO';
import { UserForgotResponseDTO } from '../dtos/response/UserForgotResponseDTO';
import { Recipient } from '../types/Recipient';
import { IJwtPayload } from '../interfaces/IJWTPayload';
import { UserLogoutResponseDTO } from '../dtos/response/UserLogoutResponseDTO';
import { UserDeactivateRequestDTO } from '../dtos/request/UserDeactivateRequestDTO';
import { UserDeactivateResponseDTO } from '../dtos/response/UserDeactivateResponseDTO';
import { UserResetResponseDTO } from '../dtos/response/UserResetResponseDTO';
import { UserResetRequestDTO } from '../dtos/request/UserResetRequestDTO';
import { IUserService } from '../interfaces/IUserService';
import { IAuthService } from '../interfaces/IAuthService';
import { IBcryptService } from '../interfaces/IBcryptService';
import { IEmailService } from '../interfaces/IEmailService';
import { ITextService } from '../interfaces/ITextService';
import { IUserRepository } from '../interfaces/IUserRepository';

    class UserService implements IUserService{

        private userRepository: IUserRepository;
        private authService: IAuthService;
        private bcryptService : IBcryptService;
        private emailService: IEmailService;
        private textService: ITextService;
        
        constructor(userRepository: IUserRepository, authService: IAuthService, bcryptService: IBcryptService, emailService: IEmailService, textService: ITextService){

            this.userRepository = userRepository;
            this.authService = authService;
            this.bcryptService = bcryptService
            this.emailService = emailService;
            this.textService = textService;
        }        
        async registerUser(reqUser: UserRegisterRequestDTO): Promise<UserRegisterResponseDTO | ErrorResponse>  {
            try{

            const { username, email, password } = reqUser;
            const userByEmailAvailable  = await this.userRepository.findByEmail(email as string);

            if (userByEmailAvailable) {
                return new ErrorResponse(409, "Email already taken!");
            }

            const userByUsernameAvailable  = await this.userRepository.findByUsername(username as string);
            if (userByUsernameAvailable) {
                return new ErrorResponse(409,"Username already taken!");
            }

            //Hash password
            const hashedPassword : string = await hash(password as string, parseInt(process.env.BCRYPT_SALT_ROUNDS as string));
            console.log("Hashed Password: ", hashedPassword);
            //update password with hashed password
            reqUser.password = hashedPassword;
            const createdUser : IUser = await this.userRepository.create(reqUser)   
            
            const userResponse : UserRegisterResponseDTO ={
                username: createdUser.username,
                email: createdUser.email,
                phone: createdUser.phone,
                failedLogins: createdUser.failedLogins,
                isEnabled: createdUser.isEnabled,
                _id: createdUser._id as mongoose.Types.ObjectId,  
                createdAt: createdUser.createdAt,
                updatedAt: createdUser.updatedAt              
            }
            // If in production environment send email
            // SEND EMAIL
            if(process.env.NODE_ENV !== "test"){
            let recipient : Recipient= {username : userResponse.username, email: userResponse.email}  
            this.emailService.sendEmail('register-account', recipient);
            }
            // SEND RESPONSE
            return userResponse;
        }catch(e: unknown){
            console.log("error in service layer ", e)
            return new ErrorResponse(500,"mongo error!");


        }
        }
        async loginUser(reqUser: UserLoginRequestDTO): Promise<UserLoginResponseDTO | ErrorResponse> {
              console.log("calling user login service......................................................")

            const { email, password } = reqUser;

            const user  = await this.userRepository.findByEmail(email);
            if(!user){
                return new ErrorResponse(400,"email does not exist");
            }else{
                if(user.isEnabled === false){  
                    const errorResponse = new ErrorResponse(423,"Account is locked, use forget account to access acount");
                    errorResponse.setEmail(user.email as string);
                    errorResponse.setUsername(user.username as string);
                    return errorResponse;    
                }
                
                //compare password with hashedpassword 
                if (user &&  await bcrypt.compare(password,user.password as string)) {

                    let payload = {
                        user: {
                        username: user.username as string , email: user.email as string , id: user._id ,
                        },
                    }
                    //post fix operator   knowing value cant be undefined
                    let secretKey  = process.env.JSON_WEB_TOKEN_SECRET! ;
                    const accessToken  =  jwt.sign( payload,secretKey as jwt.Secret,  { expiresIn: "10m" } );
                    //add token and id to auth 

                    //call auth service

                    const authenticatedUser : IAuth | null = await this.authService.findByUserId(user._id);
                    if(!authenticatedUser){

                        await this.authService.create(user._id, accessToken);
                    }else{

                        await this.authService.update(user._id, accessToken);
                    }

                    //if failed logins > 0, 
                    //reset to zero if account is not locked
                    if(user.failedLogins as number > 0){

                        const resetUser : IUser ={
                        failedLogins: 0
                        }

                        await this.userRepository.update(user._id, resetUser)
                    }
                        //res.status(200).json({ accessToken }); 
                    const userResponse :UserLoginResponseDTO = {
                        accessToken: accessToken
                    }
                        //SEND TEXT MESSAGE
                    let recipient : Recipient= {username : user.username, email: user.email}  
                    this.textService.sendSms("+18777804236",recipient);
                    return userResponse;
                }else{ 
                    // handle incorrect password by incrementing failed login
                    user.failedLogins = user.failedLogins  as number + 1      
                    if(user.failedLogins > 3){

                        user.isEnabled = false;
                        await this.userRepository.update(user._id, user)
                        //SEND EMAIL
                        if(process.env.NODE_ENV !== "test"){

                            let recipient : Recipient= {username : user.username, email: user.email}  
                            this.emailService.sendEmail("locked-account",recipient ); 
                        }

                        // RETURN RESPONSE TO CONTROLLER
                        const errorResponse = new ErrorResponse(400,"Account is locked because of too many failed login attempts. Use /forgt route to access acount");
                        errorResponse.setEmail(user.email as string);
                        errorResponse.setUsername(user.username as string);
                        return errorResponse;

                    }else{
                        await this.userRepository.update(user._id, user)    
                    }      
                    //res.status(400).json({ message: "email or password is incorrect" });
                    return new ErrorResponse(400, "email or password is incorrect");

                }


            }
        }

    async forgotUser(reqUser: UserForgotRequestDTO): Promise<UserForgotResponseDTO | ErrorResponse> {
        const { email } = reqUser;
        const user  = await this.userRepository.findByEmail(email);
        if (!user) {
            return new ErrorResponse(400,`Invalid Email: ${email}`);
        }else{
            // call bcrypt service and generate random hashed password
            const hashedPassword : string = await this.bcryptService.getHashedPassword();
            const uuid : string = this.bcryptService.getUUID();

            console.log("Hashed Password: ", hashedPassword);
            console.log("uuid: ", uuid)
            //store generated password in database and unlock account
            const updatedUser : IUser = {
            password : hashedPassword,
            failedLogins : 0,
            isEnabled : true
            }
            await this.userRepository.update(user._id, updatedUser);

            // SEND EMAIL
            let recipient : Recipient ={
                username : user.username,
                email : user.email,
                password : uuid
            }
            if(process.env.NODE_ENV !== "test"){

                this.emailService.sendEmail("forgot-password",recipient);
            }

            //SEND RESPONSE
            const userResponse : UserForgotResponseDTO =  {
                password : uuid
            }

            return userResponse;

        }

    }

    async logoutUser(jwtPayload: IJwtPayload): Promise<UserLogoutResponseDTO | ErrorResponse> {
        const token = jwtPayload?.token 
        const {username} = jwtPayload.user
        const authenticatedUser = await this.authService.findByToken(token as string);
        if(!authenticatedUser){
            return new ErrorResponse(401, "Already logged out" );
        }
        //remove auth from Auth Collection
  
        // await this.authRepository.remove(logoutAuth)
        //call service
        await this.authService.remove(token)

        const userResponse : UserLogoutResponseDTO = {
            message: `Successfully logged out user ${username}`
        }

        return userResponse;
    }



    async deactivateUser(reqUser: UserDeactivateRequestDTO): Promise<UserDeactivateResponseDTO | ErrorResponse> {
            
            const {email, password, confirm} = reqUser;
            const registeredUser = await this.userRepository.findByEmail(email);
            if(!registeredUser){
                return new ErrorResponse(400,"Email does not exist");
            }

            if(!(await bcrypt.compare(password,registeredUser?.password as string))) {
                return new ErrorResponse(400,"Invalid password or email");
            }
            // calling auth service

            await this.authService.removeByUserID(registeredUser._id)

            await this.userRepository.remove(registeredUser!._id);

            // SEND EMAIL
            let recipient : Recipient ={
                username : registeredUser.username,
                email : email,
            }

            if(process.env.NODE_ENV !== "test"){

                this.emailService.sendEmail("forgot-password",recipient);
            }

            //SEND RESPONSE
            const userResponse : UserDeactivateResponseDTO = {
                message: `deactivated acoount with email ${email}`
            }

            return userResponse;

        }

        async resetUser(reqUser: UserResetRequestDTO): Promise<UserResetResponseDTO | ErrorResponse> {
            const { email, oldPassword, newPassword } = reqUser;

            const user  = await this.userRepository.findByEmail(email);
            if (!user) {
                return new ErrorResponse(400,`Invalid Email! ${email}`);
            }else{
                if(!(await bcrypt.compare(oldPassword,user.password as string))){
                    return new ErrorResponse(400,`Invalid password`);
                }else{
                    const hashedPassword : string = await bcrypt.hash(newPassword , parseInt(process.env.BCRYPT_SALT_ROUNDS as string));
                    console.log("Hashed Password: ", hashedPassword);
                    const updatedUser : IUser = {
                        password : hashedPassword,

                    }
                    await this.userRepository.update(user._id, updatedUser)
                    // SEND EMAIL
                    let recipient : Recipient ={
                        username : user.username,
                        email : email,
                    }
                    this.emailService.sendEmail("reset-password",recipient);

                    //SEND RESPONSE
                    const userResponse : UserResetResponseDTO = {
                        message: `Successfully reset password of acoount with email '${email}'`
                    }

                    return userResponse;

                }

            }
        }

    }

    
    export default UserService;

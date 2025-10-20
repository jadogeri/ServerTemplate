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




// import { Recipient } from "../../types/Recipient";
// import { sendEmail } from "../../tools/mail/utils/sendEmail";
// import { sendSms } from "../../tools/phone/sendSms";
 
    class UserService {

        private userRepository: UserRepository;
        private authRepository: AuthRepository;
        
        constructor(userRepository: UserRepository, authRepository: AuthRepository){

            this.userRepository = userRepository;
            this.authRepository = authRepository;
        }        
        async registerUser(reqUser: UserRegisterRequestDTO): Promise<UserRegisterResponseDTO | ErrorResponse>  {

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

            console.log("created user: " + createdUser)
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
            return userResponse;
        }
        async loginUser(reqUser: UserLoginRequestDTO): Promise<UserLoginResponseDTO | ErrorResponse> {
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
                    const authUser : IAuth = {
                        id : user._id,
                        token : accessToken
                    }

                    const authenticatedUser = await this.authRepository.findByUserId(user._id);
                    if(!authenticatedUser){

                        await this.authRepository.create(authUser);
                    }else{

                        await this.authRepository.update(authUser);;     
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

                    return userResponse;
                }else{ 
                    // handle incorrect password by incrementing failed login
                    user.failedLogins = user.failedLogins  as number + 1      
                    if(user.failedLogins > 3){

                        user.isEnabled = false;
                        await this.userRepository.update(user._id, user)

                        const errorResponse = new ErrorResponse(400,"Account is locked because of too many failed login attempts. Use /forgot route to access acount");
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
















        async currentUser(){
            return {"message": "current user"}
        }

        async deactivateUser(){
            return {"message": "deactivate user"}
        }
        async forgotUser(){
            return {"message": "forgot user"}
        }

        async logoutUser(){
            return {"message": "log out user"}
        }

        async resetUser(){
            return {"message": "reset user"}
        }

    }

    
    export default UserService;

/**
 * 
 

loginUser = asyncHandler(async (req : Request, res: Response)  => {


  const user  = await userService.getByEmail(email);

  if(user){

    if(user.isEnabled === false){      
      errorBroadcaster(res,423,"Account is locked, use forget account to access acount")
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
      const accessToken  =  jwt.sign( payload,secretKey as jwt.Secret,  { expiresIn: "30m" } );
      //add token and id to auth 
      const authUser : IAuth = {
        id : user._id,
        token : accessToken
      }

      const authenticatedUser = await authService.getById(user._id);
      if(!authenticatedUser){

        await authService.create(authUser);
      }else{

        await authService.update(authUser);;     
      }

      //if failed logins > 0, 
      //reset to zero if account is not locked
      if(user.failedLogins as number > 0){

        const resetUser : IUser ={
          failedLogins: 0
        }

        await userService.update(user._id, resetUser)
      }
        res.status(200).json({ accessToken }); 
    }else{ 
      user.failedLogins = user.failedLogins  as number + 1      
      if(user.failedLogins === 3){

        user.isEnabled = false;
        await userService.update(user._id, user)
              const recipient : Recipient = {
                username : user.username,
                email : user.email,
                company : process.env.COMPANY
              }
        sendEmail("locked-account",recipient )
        res.status(400).json("Account is locked beacause of too many failed login attempts. Use forget account to access acount");

      }else{
        await userService.update(user._id, user)    
      }      
      res.status(400).json({ message: "email or password is incorrect" });
    }
  }else{
    res.status(400).json({ message: "email does not exist" });
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
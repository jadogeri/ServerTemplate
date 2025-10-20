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

    async removeByUserID(userID: mongoose.Types.ObjectId){
      const auth : IAuth = {
        id : userID
      }

      return await this.authRepository.remove(auth)
    }


    }

    
    export default AuthService;


    // src/services/user.service.ts
    import mongoose from 'mongoose';
import { IAuth } from '../interfaces/IAuth';
import { IAuthService } from '../interfaces/IAuthService';
import { IAuthRepository } from '../interfaces/IAuthRepository';


    class AuthService implements IAuthService{

        private authRepository: IAuthRepository;
        
        constructor(authRepository: IAuthRepository){

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

/**
     * Removes the authentication token from the repository.
     * @param token - The authentication token to be removed.
     * @returns A promise that resolves to the result of the removal operation.
     * @throws Throws an error if the removal operation fails.
     */
    async remove(token: string){
      const auth : IAuth = {
        token : token
      }

      return await this.authRepository.remove(auth)
    }

/**
   * Removes an authentication record by the specified user ID.
   * @param userID - The ObjectId of the user whose authentication record is to be removed.
   * @returns A promise that resolves to the result of the removal operation.
   * @throws Throws an error if the removal operation fails.
   */
    async removeByUserID(userID: mongoose.Types.ObjectId){
      const auth : IAuth = {
        id : userID
      }

      return await this.authRepository.remove(auth)
    }


    }

    
    export default AuthService;


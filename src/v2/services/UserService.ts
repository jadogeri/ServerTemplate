    // src/services/user.service.ts
    import UserRepository from '../repositories/UserRepository';
    import User from '../models/UserModel';
    import { IUser } from '../interfaces/IUser';

    class UserService {

        async currentUser(){
            return {"message": "current user"}
        }

        async deactivateUser(){
            return {"message": "deactivate user"}
        }
        async forgotUser(){
            return {"message": "forgot user"}
        }

        async loginUser(){
            return {"message": "login user"}
        }

        async logoutUser(){
            return {"message": "log out user"}
        }

        async registerUser(){
            return {"message": "register user"}
        }

        async resetUser(){
            return {"message": "reset user"}
        }

    }

    export default new UserService();


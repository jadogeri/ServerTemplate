import UserController from "../controllers/UserController";
import UserService from "../services/UserService";
import UserRepository from "../repositories/UserRepository";
import EmailService from "../services/EmailService";
import AuthRepository from "../repositories/AuthRepository";
import BcryptService from "../services/BcryptService";
import AuthService from "../services/AuthService";
import CredentialValidatorService from "../services/CredentialValidatorService";
import TextService from "../services/TextService";

export const getController = ()=>{
    const emailService = new EmailService();
    const textService = new TextService();
    const credentialValidatorService = new CredentialValidatorService();
    const userRepository = new UserRepository();
    const authRepository = new AuthRepository();
    const authService = new AuthService(authRepository);

    const bcryptService = new BcryptService();
    const userService = new UserService(userRepository, authService, bcryptService, emailService, textService);
    const userController = new UserController(userService, credentialValidatorService);

    return userController;
}
import express from "express";

import UserController from "../controllers/UserController";
import UserService from "../services/UserService";
import UserRepository from "../repositories/UserRepository";
import EmailService from "../services/EmailService";
import AuthRepository from "../repositories/AuthRepository";
import BcryptService from "../services/BcryptService";
import AuthService from "../services/AuthService";
import CredentialValidatorService from "../services/CredentialValidatorService";

const emailService = new EmailService();
const credentialValidatorService = new CredentialValidatorService();
const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

const bcryptService = new BcryptService();
const userService = new UserService(userRepository, authService, bcryptService, emailService);
const userController = new UserController(userService, credentialValidatorService);
const validateToken = require("../middlewares/validateTokenHandler");

const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/logout",validateToken, userController.logoutUser);

router.post("/reset", userController.resetUser);

router.get("/current", validateToken, userController.currentUser);

router.post("/forgot", userController.forgotUser);

router.delete("/deactivate",userController. deactivateUser);

module.exports = router;
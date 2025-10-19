import express from "express";
import UserController from "../controllers/UserController";
import UserService from "../services/UserService";

const userService = new UserService();
const userController = new UserController(userService)
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
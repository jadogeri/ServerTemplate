import express from "express";

/*
const { registerUser, loginUser, logoutUser, resetUser, forgotUser, deactivateUser, currentUser } = require("../controllers/userController/index");
*/

const {loginUser, registerUser, logoutUser, resetUser, currentUser, forgotUser} = require("../controllers/userController/index");


const validateToken = require("../middlewares/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login",loginUser);

router.post("/logout",validateToken, logoutUser);

router.post("/reset", resetUser);

router.get("/current", validateToken, currentUser);

router.post("/forgot", forgotUser);




/*

router.delete("/deactivate", deactivateUser);


router.post("/forgot", forgotUser);


*/

module.exports = router;
import express from "express";


const {loginUser, registerUser, logoutUser, resetUser, currentUser, forgotUser, deactivateUser} = require("../controllers/userController/index");

const validateToken = require("../middlewares/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login",loginUser);

router.post("/logout",validateToken, logoutUser);

router.post("/reset", resetUser);

router.get("/current", validateToken, currentUser);

router.post("/forgot", forgotUser);

router.delete("/deactivate", deactivateUser);


module.exports = router;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { loginUser, registerUser, logoutUser, resetUser, currentUser, forgotUser, deactivateUser } = require("../controllers/userController/index");
const validateToken = require("../middlewares/validateTokenHandler");
const router = express_1.default.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", validateToken, logoutUser);
router.post("/reset", resetUser);
router.get("/current", validateToken, currentUser);
router.post("/forgot", forgotUser);
router.delete("/deactivate", deactivateUser);
module.exports = router;
//# sourceMappingURL=userRoutes.js.map
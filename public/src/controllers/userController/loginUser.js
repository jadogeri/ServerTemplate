"use strict";
/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 18-JAN-2025
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const asyncHandler = require("express-async-handler");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const userService = __importStar(require("../../services/userService"));
const authService = __importStar(require("../../services/authService"));
const errorBroadcaster_1 = require("../../utils/errorBroadcaster");
const inputValidation_1 = require("../../utils/inputValidation");
const sendEmail_1 = require("../../tools/mail/utils/sendEmail");
/**
*@desc Login user
*@route POST /api/users/login
*@access public
*/
exports.loginUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    if (!(0, inputValidation_1.isValidEmail)(email)) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "not a valid standard email address");
    }
    const user = yield userService.getByEmail(email);
    if (user) {
        if (user.isEnabled === false) {
            (0, errorBroadcaster_1.errorBroadcaster)(res, 423, "Account is locked, use forget account to access acount");
        }
        //compare password with hashedpassword 
        if (user && (yield bcrypt.compare(password, user.password))) {
            let payload = {
                user: {
                    username: user.username, email: user.email, id: user._id,
                },
            };
            //post fix operator   knowing value cant be undefined
            let secretKey = process.env.JSON_WEB_TOKEN_SECRET;
            const accessToken = jwt.sign(payload, secretKey, { expiresIn: "30m" });
            //add token and id to auth 
            const authUser = {
                id: user._id,
                token: accessToken
            };
            const authenticatedUser = yield authService.getById(user._id);
            if (!authenticatedUser) {
                yield authService.create(authUser);
            }
            else {
                yield authService.update(authUser);
                ;
            }
            //if failed logins > 0, 
            //reset to zero if account is not locked
            if (user.failedLogins > 0) {
                const resetUser = {
                    failedLogins: 0
                };
                yield userService.update(user._id, resetUser);
            }
            res.status(200).json({ accessToken });
        }
        else {
            user.failedLogins = user.failedLogins + 1;
            if (user.failedLogins === 3) {
                user.isEnabled = false;
                yield userService.update(user._id, user);
                const recipient = {
                    username: user.username,
                    email: user.email,
                    company: process.env.COMPANY
                };
                (0, sendEmail_1.sendEmail)("locked-account", recipient);
                res.status(400).json("Account is locked beacause of too many failed login attempts. Use forget account to access acount");
            }
            else {
                yield userService.update(user._id, user);
            }
            res.status(400).json({ message: "email or password is incorrect" });
        }
    }
    else {
        res.status(400).json({ message: "email does not exist" });
    }
}));
//# sourceMappingURL=loginUser.js.map
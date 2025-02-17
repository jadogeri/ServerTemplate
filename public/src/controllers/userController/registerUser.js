"use strict";
/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 27-JAN-2025
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
exports.registerUser = void 0;
const asyncHandler = require("express-async-handler");
const bcrypt_1 = require("bcrypt");
const userService = __importStar(require("../../services/userService"));
const errorBroadcaster_1 = require("../../utils/errorBroadcaster");
const inputValidation_1 = require("../../utils/inputValidation");
const sendEmail_1 = require("../../tools/mail/utils/sendEmail");
const sendSms_1 = require("../../tools/phone/sendSms");
/**
*@desc Register a user
*@route POST /api/users/register
*@access public
*/
let company = process.env.COMPANY;
exports.registerUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "All fields are mandatory!");
    }
    if (!(0, inputValidation_1.isValidEmail)(email)) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 553, "not a  valid email");
    }
    if (!(0, inputValidation_1.isValidUsername)(username)) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "not a valid username");
    }
    if (!(0, inputValidation_1.isValidPassword)(password)) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "not a valid password");
    }
    //if phone number is provided check if string is a valid phone number
    if (phone) {
        if (!(0, inputValidation_1.isValidatePhoneNumber)(phone)) {
            (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "not a valid phone number");
        }
    }
    const userByEmailAvailable = yield userService.getByEmail(email);
    if (userByEmailAvailable) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 409, "User already registered!");
    }
    const userByUsernameAvailable = yield userService.getByUsername(username);
    if (userByUsernameAvailable) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 409, "Username already taken!");
    }
    //Hash password
    const hashedPassword = yield (0, bcrypt_1.hash)(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    console.log("Hashed Password: ", hashedPassword);
    const unregisteredUser = req.body;
    unregisteredUser.password = hashedPassword;
    //const user = await userService.create(unregisteredUser)
    yield userService.create(unregisteredUser)
        .then((user) => {
        let recipient = { username: user.username, email: user.email, company: company };
        try {
            (0, sendEmail_1.sendEmail)('register-account', recipient);
            //TODO ADD PHONE SENDING
            (0, sendSms_1.sendSms)("+15045414308", recipient);
            console.log(`User created ${JSON.stringify(user)}`);
            if (user) {
                //send response 
                res.status(201).json(user);
            }
            else {
                res.status(400).json({ message: "something went wrong" });
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}));
//# sourceMappingURL=registerUser.js.map
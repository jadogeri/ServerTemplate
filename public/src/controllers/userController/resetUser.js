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
exports.resetUser = void 0;
const asyncHandler = require("express-async-handler");
const userService = __importStar(require("../../services/userService"));
const errorBroadcaster_1 = require("../../utils/errorBroadcaster");
const bcrypt = __importStar(require("bcrypt"));
const inputValidation_1 = require("../../utils/inputValidation");
const sendEmail_1 = require("../../tools/mail/utils/sendEmail");
/**
*@desc Reset a user
*@route PUT /api/users/reset
*@access public
*/
exports.resetUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, new_password, old_password } = req.body;
    console.log(email, new_password, old_password);
    if (!email || !new_password || !old_password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    if (!(0, inputValidation_1.isValidEmail)(email)) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "not a  valid email");
    }
    if (!(0, inputValidation_1.isValidPassword)(new_password)) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "not a valid new password");
    }
    const user = yield userService.getByEmail(email);
    if (!user) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, `Invalid Email ${email}`);
    }
    else {
        if (!(yield bcrypt.compare(old_password, user.password))) {
            (0, errorBroadcaster_1.errorBroadcaster)(res, 400, `Invalid password`);
        }
        else {
            const hashedPassword = yield bcrypt.hash(new_password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
            console.log("Hashed Password: ", hashedPassword);
            const updatedUser = {
                password: hashedPassword,
            };
            yield userService.update(user._id, updatedUser);
            const recipient = {
                username: user.username,
                email: user.email,
                company: process.env.COMPANY
            };
            (0, sendEmail_1.sendEmail)("reset-password", recipient);
            res.status(200).json({ message: "updated user password" });
        }
    }
    res.json({ message: "something went wrong" });
}));
//# sourceMappingURL=resetUser.js.map
"use strict";
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
exports.deactivateUser = void 0;
const asyncHandler = require("express-async-handler");
const errorBroadcaster_1 = require("../../utils/errorBroadcaster");
const userService = __importStar(require("../../services/userService"));
const authService = __importStar(require("../../services/authService"));
const bcrypt = __importStar(require("bcrypt"));
const inputValidation_1 = require("../../utils/inputValidation");
const sendEmail_1 = require("../../tools/mail/utils/sendEmail");
/**
*@desc Deactivate a user
*@route POST /api/users/deactivate
*@access public
*/
exports.deactivateUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, confirm } = req.body;
    if (!email || !password || confirm == undefined) {
        console.log(email, password, confirm);
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "All fields are mandatory!");
    }
    if (!(0, inputValidation_1.isValidEmail)(email)) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "not a  valid email");
    }
    if (confirm !== true) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "confirm must be true");
    }
    const registeredUser = yield userService.getByEmail(email);
    if (!registeredUser) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "Email does not exist");
    }
    if (!(yield bcrypt.compare(password, registeredUser === null || registeredUser === void 0 ? void 0 : registeredUser.password))) {
        (0, errorBroadcaster_1.errorBroadcaster)(res, 400, "Invalid password or email");
    }
    const deactivateAuth = {
        id: registeredUser === null || registeredUser === void 0 ? void 0 : registeredUser._id
    };
    yield authService.remove(deactivateAuth);
    yield userService.remove(registeredUser._id);
    const recipient = {
        username: registeredUser === null || registeredUser === void 0 ? void 0 : registeredUser.username,
        email: registeredUser === null || registeredUser === void 0 ? void 0 : registeredUser.email,
        company: process.env.COMPANY
    };
    (0, sendEmail_1.sendEmail)("deactivate-account", recipient);
    res.json({ message: `deactivated acoount with email ${email}` });
}));
//# sourceMappingURL=deactivateUser.js.map
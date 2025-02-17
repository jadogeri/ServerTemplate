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
const jwt_decode_1 = require("jwt-decode");
const asyncHandler = require("express-async-handler");
const jwt = __importStar(require("jsonwebtoken"));
const jwt_check_expiry_1 = __importStar(require("jwt-check-expiry"));
const validateToken = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        let authHeader = req.headers.authorization;
        console.log("authheader = ", authHeader);
        if (!authHeader || !authHeader.startsWith("Bearer") || !authHeader.split(" ")[1].trim()) {
            console.log("authheader = if  ");
            res.status(401).json("User not authorized or token missing");
        }
        else {
            console.log("authheader = else  ");
            token = authHeader.split(" ")[1];
            console.log('isExpired is:', (0, jwt_check_expiry_1.default)(token));
            if ((0, jwt_check_expiry_1.default)(token)) {
                res.status(401);
                throw new Error("token has expired");
            }
            const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET);
            console.log("decoded = ", decoded);
            console.log('Decoded token :', (0, jwt_check_expiry_1.decode)(token));
            const decodedPayload = (0, jwt_decode_1.jwtDecode)(token);
            const { user } = decodedPayload;
            if (decoded) {
                req.user = user;
                next();
            }
            else {
                res.status(401);
                throw new Error("User not authorized!");
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}));
module.exports = validateToken;
//# sourceMappingURL=validateTokenHandler.js.map
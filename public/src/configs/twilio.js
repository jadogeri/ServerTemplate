"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twilioClient = exports.twilioPhoneNumber = exports.twilioAuthToken = exports.twilioAccountSid = void 0;
const twilio_1 = __importDefault(require("twilio"));
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
exports.twilioAccountSid = twilioAccountSid;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
exports.twilioAuthToken = twilioAuthToken;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
exports.twilioPhoneNumber = twilioPhoneNumber;
const twilioClient = (0, twilio_1.default)(twilioAccountSid, twilioAuthToken);
exports.twilioClient = twilioClient;
//# sourceMappingURL=twilio.js.map
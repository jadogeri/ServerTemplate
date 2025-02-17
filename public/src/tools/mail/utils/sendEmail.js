"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const loadTemplate_1 = require("./loadTemplate");
const transportMail_1 = __importDefault(require("./transportMail"));
const sendEmail = (templateName, recipient) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, loadTemplate_1.loadTemplate)(templateName, recipient)
        .then((result) => {
        const mail = {
            to: result.recipient.email,
            from: recipient.company,
            subject: result.email.subject,
            html: result.email.html,
            text: result.email.text,
        };
        if (!recipient.email || recipient.email == undefined) {
            throw new Error("email is required!!");
        }
        (0, transportMail_1.default)(mail)
            .then(() => {
            console.log("sent!!");
        })
            .catch((error) => {
            return error;
        });
    })
        .catch((error) => {
        return error;
    });
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map
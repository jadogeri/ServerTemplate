"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transportMail;
const nodemailer_1 = require("../../../configs/nodemailer");
/**
 * Sends an email using the provided mail object.
 * @param mail - The email configuration object containing recipient, subject, and body.
 * @returns A promise that resolves when the email is sent successfully.
 * @throws Will throw an error if the email sending fails.
 */
function transportMail(mail) {
    return nodemailer_1.transporter.sendMail(mail);
}
//# sourceMappingURL=transportMail.js.map
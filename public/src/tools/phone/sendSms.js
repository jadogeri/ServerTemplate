"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = void 0;
const twilio_1 = require("../../configs/twilio");
/**
 * Sends an SMS message to a specified recipient using Twilio.
 * @param recipientPhoneNumber - The phone number of the recipient in string format.
 * @param recipient - An object representing the recipient (type Recipient).
 * @returns void
 * @throws Error if the SMS sending fails.
 */
const sendSms = (recipientPhoneNumber, recipient) => {
    twilio_1.twilioClient.messages
        .create({
        from: twilio_1.twilioPhoneNumber,
        to: recipientPhoneNumber,
        body: "Hello from Twilio and TypeScript!",
    })
        .then((message) => console.log(`Message SID: ${message.sid}`))
        .catch((error) => console.error(`Error sending SMS: ${error}`));
};
exports.sendSms = sendSms;
//# sourceMappingURL=sendSms.js.map
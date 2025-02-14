import { twilioClient, twilioPhoneNumber } from "../../configs/twilio";
import { Recipient } from "../../types/Recipient";


/**
 * Sends an SMS message to a specified recipient using Twilio.
 * @param recipientPhoneNumber - The phone number of the recipient in string format.
 * @param recipient - An object representing the recipient (type Recipient).
 * @returns void
 * @throws Error if the SMS sending fails.
 */
export const sendSms = (recipientPhoneNumber : string, recipient : Recipient)=>{

    twilioClient.messages
    .create({
      from: twilioPhoneNumber,
      to: recipientPhoneNumber,
      body: "Hello from Twilio and TypeScript!",
    })
    .then((message) => console.log(`Message SID: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error}`));

}
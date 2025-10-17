import Twilio from "twilio"


const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER 

const twilioClient = Twilio(twilioAccountSid, twilioAuthToken);
export {twilioAccountSid, twilioAuthToken, twilioPhoneNumber, twilioClient}


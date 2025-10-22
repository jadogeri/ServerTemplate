
import { Mail } from "../types/Mail"
import { Recipient } from "../types/Recipient"
import { loadTemplate } from "../tools/mail/utils/loadTemplate"
import transportMail from "../tools/mail/utils/transportMail"
import { EmailContext } from "../entities/EmailContext"

// import { sendSms } from "../../tools/phone/sendSms";
 
class TextService {

  constructor(){
  }        

  sendSms =() =>  {
  }
 
}    

export default TextService;




















/**
 * 

   .then((user: IUser)=>{
 
     let recipient : Recipient= {username : user.username, email: user.email, company : company}  
 try{  
    sendEmail('register-account', recipient);
    //TODO ADD PHONE SENDING
   //  sendSms("YOUR TWILIO PHONE NUMBER",recipient)
   console.log(`User created ${JSON.stringify(user)}`);
   if (user) {
     //send response 
     res.status(201).json(user);
   }else{
     res.status(400).json({ message: "something went wrong" });
   }
 
 }catch(e){
   console.log(e)
 */
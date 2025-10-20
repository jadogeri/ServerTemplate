
import { Mail } from "../types/Mail"
import { Recipient } from "../types/Recipient"
import { loadTemplate } from "../tools/mail/utils/loadTemplate"
import transportMail from "../tools/mail/utils/transportMail"
import { EmailContext } from "../entities/emailContext"

// import { sendSms } from "../../tools/phone/sendSms";
 
class EmailService {

  private emailContext: EmailContext;
  constructor(){
    this.emailContext = new EmailContext();
  }        

  sendEmail =  async  (templateName : string, recipient : Recipient ) =>  {
    recipient.logoUrl = this.emailContext.getLogoUrl();
    recipient.company = this.emailContext.getCompany();
    recipient.year = this.emailContext.getYear();

    await loadTemplate(templateName, recipient)
    .then((result: any) => {
        const mail : Mail = {
            to: result.recipient.email ,
            from: recipient.company as string,
            subject: result.email.subject,
            html: result.email.html,
            text: result.email.text,            
        }    
        if(!recipient.email || recipient.email == undefined){
            throw new Error("email is required!!")
        }
        transportMail(mail)
        .then(()=>{
            console.log("sent!!")
        })
        .catch((error :any )=>{
            return error
        } )    

    })
    .catch((error: unknown)=>{
        return error
    })    
  
  }
}    

export default EmailService;




















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
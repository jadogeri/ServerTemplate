import { Mail } from "../../../types/Mail"
import { Recipient } from "../../../types/Recipient"
import { loadTemplate } from "./loadTemplate"
import transportMail from "./transportMail"
export const sendEmail =  async  (templateName : string, recipient : Recipient ) =>  {

 
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
    .catch((error)=>{
        return error
    })  
    
  
}


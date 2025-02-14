import { Mail } from "../../../types/Mail"
import { Recipient } from "../../../types/Recipient"
import { loadTemplate } from "./loadTemplate"
import transportMail from "./transportMail"
export const sendEmail =  (templateName : string, recipient : Recipient ) =>  {

    loadTemplate(templateName, recipient)
    .then((result: any) => {
        const mail : Mail = {
            to: result.recipient.email ,
            from: recipient.company as string,
            subject: result.email.subject,
            html: result.email.html,
            text: result.email.text,            
        }    
        transportMail(mail)
        .then(()=>{
            console.log("sent!!")
        })
          console.log("printing results.....................",JSON.stringify(result,null,4))
  
     

      })
      
    
  
}


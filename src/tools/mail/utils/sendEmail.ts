import { Mail } from "../../../types/Mail"
import { Recipient } from "../../../types/Recipient"
import { loadTemplate } from "./loadTemplate"
import transportMail from "./transportMail"
/**
 * Sends an email using a specified template and recipient information.
 * It loads the email template, constructs the mail object, and sends the email.
 * Logs the result of the email sending process and the loaded template details.
 * 
 * @param templateName - The name of the email template to be used.
 * @param recipient - The recipient object containing email and company information.
 * @returns Promise<void> - Resolves when the email is sent successfully.
 * @throws Error - Throws an error if loading the template or sending the email fails.
 */
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


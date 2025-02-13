import { Recipient } from "../../../types/Recipient"
import { loadTemplate } from "./loadTemplate"
export const sendEmail = async (templateName : string, recipient : Recipient ) =>  {

    await loadTemplate()
  
}


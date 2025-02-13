import Email from "email-templates";
import { Recipient } from "../../../types/Recipient";

const path = require('path')
const Promise = require('bluebird');
const  { EmailTemplate }= require("../../../configs/nodemailer")


export function loadTemplate (templateName: string, recipient: Recipient) {
    let template = new EmailTemplate(path.join(__dirname + "/../", 'templates', templateName));
    
        return new Promise((resolve: (arg0: { email: Email; recipient: Recipient; }) => void, reject: (arg0: any) => void) => {
            template.render(recipient, (err: any, result: any) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    recipient,
                });
            });
        });
  
}

module.exports = { loadTemplate }
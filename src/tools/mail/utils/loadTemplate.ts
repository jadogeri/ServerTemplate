import { Recipient } from "../../../types/Recipient";

const path = require('path')
const Promise = require('bluebird');
const  { EmailTemplate }= require("../../../configs/nodemailer")


/**
 * Loads and renders an email template for a specified recipient.
 * @param templateName - The name of the email template to load.
 * @param recipient - The recipient object containing the necessary data for rendering the template.
 * @returns A promise that resolves with an object containing the rendered email and recipient data.
 * @throws Will reject the promise if there is an error during template rendering.
 */
export function loadTemplate (templateName: string, recipient: Recipient) {
    let template = new EmailTemplate(path.join(__dirname + "/../", 'templates', templateName));
        return new Promise((resolve: (arg0: { email: any; recipient: any; }) => void, reject: (arg0: any) => void) => {
            template.render(recipient, (err: any, result: any) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    recipient : recipient,
                });
            });
        });
    
}

module.exports = { loadTemplate }
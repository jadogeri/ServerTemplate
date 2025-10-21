import { Error } from "mongoose";
import { Recipient } from "../../../types/Recipient";
const path = require('path')
//import {Promise} from 'bluebird';
const EmailTemplate  = require('email-templates').EmailTemplate 


/**
 * Loads and renders an email template for a specified recipient.
 * @param templateName - The name of the email template to load.
 * @param recipient - The recipient object containing the necessary data for rendering the template.
 * @returns A promise that resolves with an object containing the rendered email and recipient data.
 * @throws Will reject the promise if there is an error during template rendering.
 */
export async function loadTemplate (templateName: string, recipient: Recipient) {
    let template = new EmailTemplate(path.join(__dirname + "/../", 'templates', templateName));
    const dataPromise =  new Promise((resolve: (arg0: { email: any; recipient: any; }) => void, reject: (arg0: any) => void) => {
        template.render(recipient, (err: Error, result: any) => {
            if (err ){ 
                return reject(err)
            } else {
                return resolve({  email: result, recipient : recipient,
            });
        }
        })
    });

    let value = await dataPromise;
    return value;
    
}

module.exports = { loadTemplate }


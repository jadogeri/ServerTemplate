import { Recipient } from "../../../types/Recipient";

const path = require('path')
const Promise = require('bluebird');
const  { EmailTemplate }= require("../../../configs/nodemailer")


export function loadTemplate (templateName: string, contexts: Recipient[]) {
    let template = new EmailTemplate(path.join(__dirname + "/../", 'templates', templateName));
    return Promise.all(contexts.map((context:Recipient) => {
        return new Promise((resolve: (arg0: { email: any; context: any; }) => void, reject: (arg0: any) => void) => {
            template.render(context, (err: any, result: any) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            });
        });
    }));
}

module.exports = { loadTemplate }
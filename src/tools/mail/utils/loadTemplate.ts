import path from "path"
const Promise = require('bluebird');
import  { EmailTemplate, Email }  from "../../../configs/nodemailer";


export const loadTemplate = (templateName: string , contexts: any[]) => {
    let filepath = path.join(__dirname + "/../", 'templates');

    console.log("dirname =================",__dirname)
    let template = new Email(
        {
            
        }
    );
    


    return Promise.all(contexts.map((context) => {
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


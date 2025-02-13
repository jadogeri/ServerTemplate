import {transporter} from "../../../configs/nodemailer";
export default function sendEmail (obj: any) {
    console.log("printining objecs== ", obj)
    return transporter.sendMail(obj);
}




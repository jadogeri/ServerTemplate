import {transporter} from "../../../configs/nodemailer";
export default function transportMail (mail: any) {
    console.log("printining starts================================================")

    console.log("printining objecs== ", mail)
    console.log("printining ends================================================")
    return transporter.sendMail(mail);
}




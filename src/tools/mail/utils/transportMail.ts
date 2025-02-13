import {transporter} from "../../../configs/nodemailer";
export default function transportMail (obj: any) {
    console.log("printining starts================================================")

    console.log("printining objecs== ", obj)
    console.log("printining ends================================================")
    return transporter.sendMail(obj);
}




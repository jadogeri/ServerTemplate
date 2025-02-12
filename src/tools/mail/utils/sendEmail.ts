const { transporter } = require("../../../configs/nodemailer")

export default function sendEmail (obj: any) {
    return transporter.sendMail(obj);
}




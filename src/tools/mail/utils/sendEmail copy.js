const { transporter } = require("../../../configs/nodemailer")

export default function sendEmail (obj) {
    return transporter.sendMail(obj);
}


module.exports = { sendEmail };


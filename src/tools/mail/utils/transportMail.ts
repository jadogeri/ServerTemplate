import {transporter} from "../../../configs/nodemailer";
/**
 * Sends an email using the provided mail object.
 * @param mail - The email configuration object containing recipient, subject, and body.
 * @returns A promise that resolves when the email is sent successfully.
 * @throws Will throw an error if the email sending fails.
 */
export default function transportMail (mail: any) {
    return transporter.sendMail(mail);
}




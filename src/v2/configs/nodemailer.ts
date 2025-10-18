/**
 * @author      Joseph Adogeri
 * @since       27-AUG-2024
 * @version     1.0
 * @description configuration setting for nodemailer 
 *  
 */
const creds = { user:process.env.NODEMAILER_USERNAME,
    pass :process.env.NODEMAILER_PASSWORD};
    
export const inLineCss : Function = require('nodemailer-juice');
export const nodemailer = require('nodemailer')
export const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: creds.user,
pass: creds.pass,
},
}).use('compile', inLineCss());


module.exports = {nodemailer, transporter}



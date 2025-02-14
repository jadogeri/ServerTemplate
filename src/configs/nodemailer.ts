/**
 * @author      Joseph Adogeri
 * @since       27-AUG-2024
 * @version     1.0
 * @description configuration setting for nodemailer 
 *  
 */
const creds = { user:process.env.NODEMAILER_USERNAME,
    pass :process.env.NODEMAILER_PASSWORD};
    
const inLineCss = require('nodemailer-juice');
const nodemailer = require('nodemailer')
export const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: creds.user,
pass: creds.pass,
},
}).use('compile', inLineCss());


export const EmailTemplate = require('email-templates').EmailTemplate
const path = require('path')
import * as Promise from 'bluebird';

module.exports = {nodemailer, transporter, EmailTemplate, path, Promise}
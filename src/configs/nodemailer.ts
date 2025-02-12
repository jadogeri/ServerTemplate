/**
 * @author      Joseph Adogeri
 * @since       27-AUG-2024
 * @version     1.0
 * @description configuration setting for nodemailer 
 *  
 */

console.log("creds ==",process.env.NODEMAILER_USERNAME,process.env.NODEMAILER_PASSWORD)
const creds = { user:process.env.NODEMAILER_USERNAME,
    pass :process.env.NODEMAILER_PASSWORD};
    
import Promise from "bluebird"

import inlineCss from "@point-hub/nodemailer-inlinecss"
import { PluginFunction } from "nodemailer/lib/mailer"
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: creds.user,
pass: creds.pass,
},
}).use('compile', inlineCss() as PluginFunction);


import Email from "email-templates"
 const EmailTemplate = require('email-templates').EmailTemplate
import path from 'path';

export {nodemailer, transporter, Email, path, Promise, EmailTemplate}


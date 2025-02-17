"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = exports.nodemailer = exports.inLineCss = void 0;
/**
 * @author      Joseph Adogeri
 * @since       27-AUG-2024
 * @version     1.0
 * @description configuration setting for nodemailer
 *
 */
const creds = { user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD };
exports.inLineCss = require('nodemailer-juice');
exports.nodemailer = require('nodemailer');
exports.transporter = exports.nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: creds.user,
        pass: creds.pass,
    },
}).use('compile', (0, exports.inLineCss)());
module.exports = { nodemailer: exports.nodemailer, transporter: exports.transporter };
//# sourceMappingURL=nodemailer.js.map
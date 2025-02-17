"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTemplate = loadTemplate;
const path = require('path');
//import {Promise} from 'bluebird';
const EmailTemplate = require('email-templates').EmailTemplate;
/**
 * Loads and renders an email template for a specified recipient.
 * @param templateName - The name of the email template to load.
 * @param recipient - The recipient object containing the necessary data for rendering the template.
 * @returns A promise that resolves with an object containing the rendered email and recipient data.
 * @throws Will reject the promise if there is an error during template rendering.
 */
function loadTemplate(templateName, recipient) {
    return __awaiter(this, void 0, void 0, function* () {
        let template = new EmailTemplate(path.join(__dirname + "/../", 'templates', templateName));
        const dataPromise = new Promise((resolve, reject) => {
            template.render(recipient, (err, result) => {
                if (err) {
                    return reject(err);
                }
                else {
                    return resolve({ email: result, recipient: recipient,
                    });
                }
            });
        });
        let value = yield dataPromise;
        return value;
    });
}
module.exports = { loadTemplate };
//# sourceMappingURL=loadTemplate.js.map
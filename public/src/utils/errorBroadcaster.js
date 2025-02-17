"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorBroadcaster = void 0;
/**
 * Sends an HTTP response with the specified status code and throws an error with the provided message.
 * This function is typically used for error handling in API responses.
 *
 * @param res - The HTTP response object to send the status code.
 * @param code - The HTTP status code to set on the response.
 * @param message - The error message to include in the thrown error.
 * @returns void
 * @throws Error - Throws an error with the specified message.
 */
const errorBroadcaster = (res, code, message) => {
    if (!message) {
        res.status(code);
        throw new Error("undefined");
    }
    res.status(code);
    throw new Error(message);
};
exports.errorBroadcaster = errorBroadcaster;
//# sourceMappingURL=errorBroadcaster.js.map
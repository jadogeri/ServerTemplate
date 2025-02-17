"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeLocalStorage = void 0;
/**
 * Initializes and returns a localStorage instance for the specified path
 * if the browser's localStorage is not available.
 *
 * @param path - The file path where localStorage data will be stored.
 * @returns LocalStorage - An instance of LocalStorage for the given path.
 * @throws {Error} Throws an error if localStorage cannot be initialized.
 */
const initializeLocalStorage = (path) => {
    if (typeof localStorage === "undefined" || localStorage === null) {
        const LocalStorage = require('node-localstorage').LocalStorage;
        const localStorage = new LocalStorage(path);
        return localStorage;
    }
};
exports.initializeLocalStorage = initializeLocalStorage;
//# sourceMappingURL=localStorage.js.map
import { LocalStorage } from "node-localstorage";



/**
 * Initializes and returns a localStorage instance for the specified path 
 * if the browser's localStorage is not available. 
 * 
 * @param path - The file path where localStorage data will be stored.
 * @returns LocalStorage - An instance of LocalStorage for the given path.
 * @throws {Error} Throws an error if localStorage cannot be initialized.
 */
export const initializeLocalStorage = (path : string)=>{
if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    const localStorage : LocalStorage = new LocalStorage(path);    
    return localStorage;
    
  }
}


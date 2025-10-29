import fs from "fs";
export  default function globalSetup() {
    console.log(`running global teardown.`);

    const filePath =  "testDB.sqlite"
    

    console.log(`${filePath} was deleted successfully.`);
 
}


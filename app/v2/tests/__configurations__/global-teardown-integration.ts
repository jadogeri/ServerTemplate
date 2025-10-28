import fs from 'fs';

export  default function globalTeardown() {
    console.log(`running global integation teardown...............................`);

    const filePath =  "testDB.sqlite"

    console.log(` was deleted successfully.`);
}

// Example usage:
// removeFileAsync('path/to/your/file.txt');
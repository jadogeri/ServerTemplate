import fs from "fs";
export  default function globalTeardown() {
    console.log(`running global teardown.`);

    const filePath =  "testDB.sqlite"
    

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return;
    }
    console.log(`${filePath} was deleted successfully.`);
  });
}

// Example usage:
// removeFileAsync('path/to/your/file.txt');
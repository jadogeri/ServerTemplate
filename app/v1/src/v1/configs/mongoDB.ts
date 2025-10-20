import mongoose from "mongoose";
/**
 * Connects to a MongoDB database using the provided MongoDB URL.
 * Logs the connection details upon successful connection.
 * Throws an error and exits the process if the connection fails.
 * 
 * @param mongoURL - The MongoDB connection string.
 * @returns Promise<void>
 * @throws Error if the connection to the database fails.
 */
export const connectMongoDB = async ( mongoURL : string) => {

  try {
  const connect = await mongoose.connect(mongoURL);
  //console.log(  "Database connected: ",  connect.connection.host, connect.connection.name  );
  } catch (err ) {
    //console.log(err);
    process.exit(1);
  }
    
};





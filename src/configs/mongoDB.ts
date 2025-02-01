import mongoose from "mongoose";
export const connectMongoDB = async ( mongoURL : string) => {

  try {
  const connect = await mongoose.connect(mongoURL);
  console.log(
    "Database connected: ",
    connect.connection.host,
    connect.connection.name
    
  );
  } catch (err ) {
    console.log(err);
    process.exit(1);
  }
    
};





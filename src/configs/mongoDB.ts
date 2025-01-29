import mongoose from "mongoose";
const connectMongoDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI as string);
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

module.exports = connectMongoDB;

import mongoose from "mongoose";
import { Db_Host } from "../utils/constanst.js"

export const connectDb = async () => {
  try {
    const connectionUrl = `${process.env.MONGODB_URL}/${Db_Host}`;
    const instanceConnection = await mongoose.connect(connectionUrl);
    console.log(`MongoDB Connected!! DB HOST : ${instanceConnection.connection.host}`);
  } catch (error) {
    console.error('Error connecting mongoose to the database:', error);
    process.exit(1)
  }
}

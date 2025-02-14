import mongoose from "mongoose";

const connectMongodb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb is connected with connection",conn.connection.host)
  } catch (error) {
    console.log("Error is occure in connection with mongodb ", error.message);
    process.exit(1);
  }
};

export default connectMongodb ; 
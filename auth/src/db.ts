import pkg from "mongoose";
const { connect, connection, set } = pkg;

const connectDB = () => {
  try {
    connection.once("open", () => console.log("MongoDB connected"));
    set("strictQuery", false);
    return connect("mongodb://10.96.248.96:27017/auth");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

export default connectDB;
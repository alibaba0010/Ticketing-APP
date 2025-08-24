import pkg from "mongoose";
const { connect, connection, set } = pkg;

const connectDB = (uri: string) => {
  try {
    console.log(
      "Connecting to MongoDB........................................................."
    );
    connection.once("open", () => console.log("MongoDB connected"));
    set("strictQuery", false);
    // return connect("mongodb://auth-mongo-srv:27017/auth");
    return connect(uri);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

export default connectDB;

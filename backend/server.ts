import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config/config.env" });
const DB_URI = process.env.DB_URI;

if (DB_URI) {
  mongoose
    .connect(DB_URI)
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  throw new Error("DB_URI environment variable not set");
}

app.listen(process.env.PORT, () => {
  console.log(`Server is waiting on http://localhost:${process.env.PORT}`);
});

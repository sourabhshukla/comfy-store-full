import express from "express";
import routes from "./routes";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import ApiError from "./utils/ApiError";
import httpStatus from "http-status";
import errorHandler from "./middlewares/error";
import dotenv from "dotenv";
import { UserModel } from "./models/user.model";
import cors from "cors";
dotenv.config({ path: "./config/config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}

const app = express();

app.use(express.json());
app.use(cors());

// Used to parse form data
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "NOT_FOUND"));
});

app.use(errorHandler);

export default app;

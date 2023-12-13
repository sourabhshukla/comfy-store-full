import {
  Errback,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import ApiError from "../utils/ApiError";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internel Server Error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ApiError(400, message);
  }

  if (err.name === "ValidationError") {
    const message = err.message;
    err = new ApiError(400, message);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid`;
    err = new ApiError(400, message);
  }

  // JWT Expire Error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again`;
    err = new ApiError(400, message);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err.stack,
  });
};

export default errorHandler;

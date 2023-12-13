import { NextFunction, RequestHandler, Request } from "express";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import { userService } from "../services";
import { UserModel } from "../models/user.model";

const isAuthenticatedUser: RequestHandler = catchAsync(
  async (req, res, next) => {
    // it comes in form of Bearer <token>
    const token = req.headers?.authorization?.split(" ")[1];
    //console.log(token);

    if (!token) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "Please Login to access this resource"
        )
      );
    }
    const decodedeData = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = (await userService.getUserById(decodedeData.id)) as UserModel;
    //console.log(req.user);

    next();
  }
);

const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as string)) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          `Role ${req.user?.role} is not allowed to access this resource`
        )
      );
    }
    next();
  };
};

const isAdmin: RequestHandler = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(
      new ApiError(
        httpStatus.FORBIDDEN,
        `Role ${req.user?.role} is not allowed to access this resource`
      )
    );
  }
  next();
};

export { isAuthenticatedUser, authorizeRoles, isAdmin };

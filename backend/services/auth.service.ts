//register, login, logout, forgot password, reset password, update password

import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { User } from "../models";

interface LoginUser {
  username: string;
  email: string;
}

interface RegisterUser extends LoginUser {
  password: string;
}

interface RegisterUserWithAvatar extends RegisterUser {
  avatar?: {
    public_id: string;
    url: string;
  };
}

const createUser = async (userBody: RegisterUserWithAvatar) => {
  const isAlreadyRegistered = await User.findOne({ email: userBody.email });
  if (isAlreadyRegistered) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already registered");
  }
  const user = await User.create(userBody);
  // console.log("craeted");
  return user;
};

const getUserByEmail = (email: string, selectPassword = false) => {
  if (selectPassword) return User.findOne({ email }).select("+password");
  return User.findOne({ email });
};

const getUserByResetToken = (resetPasswordToken: string) => {
  return User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
};

const loginUser = (user: LoginUser) => {};

const logoutUser = (req: Request, res: Response, next: NextFunction) => {};

const forgotPassword = (req: Request, res: Response, next: NextFunction) => {};

const resetPassword = (req: Request, res: Response, next: NextFunction) => {};

const updatePassword = (req: Request, res: Response, next: NextFunction) => {};

export {
  createUser,
  getUserByResetToken,
  getUserByEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updatePassword,
};

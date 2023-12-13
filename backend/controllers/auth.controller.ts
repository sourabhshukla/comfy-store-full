import { NextFunction, Request, Response } from "express";
import { authService, cartService, cloudinaryService } from "../services";
import { UploadedFile } from "express-fileupload";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto";
import { User } from "../models";
import { CartModel } from "../models/cart.model";

interface LoginUser {
  email: string;
  password: string;
}

interface RegisterUser extends LoginUser {
  username: string;
  password: string;
}

interface RegisterUserWithAvatar extends RegisterUser {
  avatar?: {
    public_id: string;
    url: string;
  };
}

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //console.log("here");
    //[console.log(req.files?.avatar);
    //avatar will contain all the files in form of an array but if there is only 1 items then it will not be in form of an array
    //let file: UploadedFile = req.files?.avatar as UploadedFile;

    const file = cloudinaryService.extractAvatar(req);
    console.log("file=", file);
    // console.log("1");

    let userBody: RegisterUserWithAvatar = {
      ...req.body,
    };

    if (file) {
      const myCloud = await cloudinaryService.uploadAvatarToCloudinary(file);
      userBody.avatar = { public_id: myCloud.public_id, url: myCloud.url };
    }
    // console.log("2");
    // console.log("3");
    const user = await authService.createUser(userBody);
    const cart = await cartService.createCart(user.email);
    const token = user.getJWTToken();
    //console.log("4");
    res.status(httpStatus.CREATED).json({
      success: true,
      user,
      cart,
      token,
    });
  }
);

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userBody: LoginUser = req.body;

    const user = await authService.getUserByEmail(userBody.email, true);

    if (!user) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email or password")
      );
    }

    const isPasswordMatched = await user.comparePasswords(userBody.password);

    if (!isPasswordMatched) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email or Password")
      );
    }
    const cart = (await cartService.getCartByEmail(user.email)) as CartModel;

    const token = user.getJWTToken();

    res.status(httpStatus.OK).json({
      success: true,
      user,
      token,
      cart,
    });
  }
);

const logoutUser = (req: Request, res: Response, next: NextFunction) => {};

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.getUserByEmail(req.body.email);

    if (!user) {
      return next(new ApiError(httpStatus.NOT_FOUND, "User not Found"));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset/password/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have
    not requested this email then, please ignore`;

    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });

      res.status(httpStatus.OK).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await authService.getUserByResetToken(resetPasswordToken);

    if (!user) {
      return next(
        new ApiError(
          httpStatus.BAD_REQUEST,
          "Reset Password Token is invalid or has been expired"
        )
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(
        new ApiError(
          httpStatus.BAD_REQUEST,
          "Password and Confirm Password do not match"
        )
      );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(httpStatus.OK).json({
      success: true,
      user,
    });
  }
);

const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.getUserByEmail(
      req?.user?.email as string,
      true
    );

    if (!user) {
      return next(new ApiError(httpStatus.NOT_FOUND, "User not found"));
    }

    const isPasswordMatch = user?.comparePasswords(req.body.oldPassword);

    if (!isPasswordMatch) {
      return next(
        new ApiError(httpStatus.BAD_REQUEST, "Old Password is incorrect")
      );
    }

    // if (req.body.newPassword !== req.body.oldPasword) {
    //   return next(
    //     new ApiError(httpStatus.BAD_REQUEST, "passwords do not match")
    //   );
    // }

    user.password = req.body.newPassword;

    await user.save();

    res.status(httpStatus.OK).json({
      success: true,
      user,
    });
  }
);

export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updatePassword,
};

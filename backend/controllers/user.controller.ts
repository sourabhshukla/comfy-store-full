import { Types } from "mongoose";
import { cartService, cloudinaryService, userService } from "../services";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { RequestHandler } from "express";
import { MongooseId } from "../utils/types";
import ApiError from "../utils/ApiError";
import { destroyImage } from "../services/cloudinary.service";

export interface newUserData {
  username: string;
  email: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role?: string;
}

const getUserDetails: RequestHandler = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.user?._id as MongooseId);
  const cart = await cartService.getCartByEmail(user?.email as string);
  const token = user?.getJWTToken();
  console.log(cart);

  res.status(httpStatus.OK).json({ user, cartItems: cart?.cartItems, token });
});

const updateProfile: RequestHandler = catchAsync(async (req, res, next) => {
  const newUserData: newUserData = {
    username: req.body.username,
    email: req.body.email,
  };
  console.log(newUserData);

  let user = await userService.getUserById(req.user?._id as MongooseId);
  if (req.files?.avatar) {
    const imageId = user?.avatar?.public_id;
    if (imageId) await destroyImage(imageId as string);
    const file = cloudinaryService.extractAvatar(req);

    const myCloud = await cloudinaryService.uploadAvatarToCloudinary(file);

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  user = await userService.updateById(req.user?._id as MongooseId, newUserData);

  res.status(httpStatus.OK).json({
    success: true,
    user,
  });
});

const getAllUsers: RequestHandler = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers();

  res.status(httpStatus.OK).json({
    success: true,
    users,
  });
});

const getSingleUser: RequestHandler = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    return next(
      new ApiError(
        httpStatus.NOT_FOUND,
        `User does not exist with id: ${req.params.id}`
      )
    );
  }

  res.status(httpStatus.OK).json({
    success: true,
    user,
  });
});

const updateUserRole: RequestHandler = catchAsync(async (req, res, next) => {
  const newUserData: newUserData = {
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
  };

  await userService.updateById(req.params.id, newUserData);

  res.status(httpStatus.OK).json({
    success: true,
    message: "User updated successfully",
  });
});

const deleteUser: RequestHandler = catchAsync(async (req, res, next) => {
  // const user = await userService.getUserById(req.params.id);

  // if (!user) {
  //   return next(
  //     new ApiError(
  //       httpStatus.NOT_FOUND,
  //       `User does not exist with id: ${req.params.id}`
  //     )
  //   );
  // }

  await userService.deleteUser(req.params.id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "User Deleted successfully",
  });
});
export {
  getUserDetails,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
};

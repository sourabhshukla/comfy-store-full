import cloudinary from "cloudinary";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { UploadedFile } from "express-fileupload";
import { Request } from "express";

const extractAvatar = (req: Request) => {
  console.log(req.files);
  console.log(req.body);
  // console.log(req);
  let file: UploadedFile = req.files?.avatar as UploadedFile;
  return file?.tempFilePath;
};

const uploadAvatarToCloudinary = async (avatar: string) => {
  const options = {
    folder: "avatars",
    width: 150,
    crop: "scale",
  };
  const myCloud = await cloudinary.v2.uploader.upload(
    avatar,
    options,
    (err, result) => {
      if (err && err.message === "Could not decode base64") {
        return new ApiError(
          httpStatus.BAD_REQUEST,
          "Image size should be less than 750KB"
        );
      }
    }
  );

  return myCloud;
};

const destroyImage = async (imageId: string) => {
  await cloudinary.v2.uploader.destroy(imageId);
};

const uploadProductImage = async (imageFile: UploadedFile) => {
  const options = { folder: "products" };
  const myCloud = await cloudinary.v2.uploader.upload(
    imageFile.tempFilePath,
    options
  );
  return myCloud;
};

export {
  extractAvatar,
  uploadAvatarToCloudinary,
  destroyImage,
  uploadProductImage,
};

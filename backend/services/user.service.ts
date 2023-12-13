import { Types } from "mongoose";
import { User } from "../models";
import { newUserData } from "../controllers/user.controller";
import { MongooseId } from "../utils/types";
import { UserModel } from "../models/user.model";

const getUserById = (id: MongooseId) => {
  return User.findById(id);
};

const updateById = async (id: MongooseId, newUserData: newUserData) => {
  const user = await User.findByIdAndUpdate(id, newUserData, {
    new: true, // when true it return modified value instead of original one
    runValidation: true,
    useFindAndModify: false, // it is deprecated and is true by default so we set it to false
  });

  return user;
};

const getAllUsers = () => {
  return User.find();
};

const deleteUser = (id: MongooseId) => {
  User.findByIdAndDelete(id);
};

export { getUserById, updateById, getAllUsers, deleteUser };

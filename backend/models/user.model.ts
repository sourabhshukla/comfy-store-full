import mongoose, { InferSchemaType, Schema, Types } from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  username: {
    type: String,
    requried: [true, "PLease Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Action to be performed before save event is triggered
userSchema.pre("save", async function (next) {
  // We are using traditional function instead of using an arrow function
  // because inside arrow function "this" keyword can't be used

  // Prevents hashing of already hashed password when user updates his
  // user details, we create a separate method for updating passwords
  // this if statement checks if password field was modified or not
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
});

//Generates JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

userSchema.methods.comparePasswords = async function (enteredPassword: string) {
  return bcryptjs.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export interface UserModel extends InferSchemaType<typeof userSchema> {
  _id: Types.ObjectId;
  getJWTToken(): string;
  comparePasswords(enteredPassword: string): boolean;
  getResetPasswordToken(): string;
}

//export type User = InferSchemaType<typeof userSchema> & { _id: string };

export default mongoose.model<UserModel>("User", userSchema);

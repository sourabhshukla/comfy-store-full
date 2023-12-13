import express, { NextFunction, Request, Response } from "express";
import { authController } from "../controllers";
import {
  authorizeRoles,
  isAuthenticatedUser,
  isAdmin,
} from "../middlewares/auth";
const router = express.Router();

router.get(
  "/test",
  isAuthenticatedUser,
  isAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    res.send("authenticated");
  }
);

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post(
  "/password/forgot",

  authController.forgotPassword
);
router.put(
  "/password/reset/:token",

  authController.resetPassword
);
router.put(
  "/password/update",
  isAuthenticatedUser,
  authController.updatePassword
);

//ADMIN ROUTES

export default router;

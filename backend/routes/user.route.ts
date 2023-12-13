import express from "express";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth";
import { userController } from "../controllers";
const router = express.Router();

router.get("/me", isAuthenticatedUser, userController.getUserDetails);
router.put("/me/update", isAuthenticatedUser, userController.updateProfile);

//ADMIN ROUTES
router.get(
  "/admin/users",
  isAuthenticatedUser,
  isAdmin,
  userController.getAllUsers
);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, isAdmin, userController.getSingleUser)
  .put(isAuthenticatedUser, isAdmin, userController.updateUserRole)
  .delete(isAuthenticatedUser, isAdmin, userController.deleteUser);

export default router;

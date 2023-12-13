import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth";
import { cartController } from "../controllers";
const router = express.Router();

router.get("/", isAuthenticatedUser, cartController.getCartProducts);
router.delete("/", isAuthenticatedUser, cartController.emptyCart);
router.post("/:productId", isAuthenticatedUser, cartController.addToCart);
router.put("/:productId", isAuthenticatedUser, cartController.updateCart);
router.delete(
  "/:productId",
  isAuthenticatedUser,
  cartController.deleteCartItems
);

export default router;

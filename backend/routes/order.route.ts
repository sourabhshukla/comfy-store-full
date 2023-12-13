import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth";
import { orderController } from "../controllers";
const router = express.Router();

router.post("/", isAuthenticatedUser, orderController.checkout);
router.get("/", isAuthenticatedUser, orderController.getAllOrders);

export default router;

import express from "express";
import { productController } from "../controllers";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth";
const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductDetails);
router.post("/upload", productController.uploadData);

//ADMIN ROUTES
router.get("/admin/products", isAuthenticatedUser, isAdmin);
router.post("/admin/product/new", isAuthenticatedUser, isAdmin);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, isAdmin)
  .delete(isAuthenticatedUser, isAdmin);

router.put("/review", isAuthenticatedUser);
router.route("/reviews").get().delete(isAuthenticatedUser);
export default router;

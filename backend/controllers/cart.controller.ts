import { RequestHandler } from "express";
import catchAsync from "../utils/catchAsync";
import { cartService, productService } from "../services";
import { MongooseId } from "../utils/types";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

//interface Cart

interface CartItem {
  productId: MongooseId;
  quantity: number;
  color: string;
}

const getCartProducts: RequestHandler = catchAsync(async (req, res, next) => {
  const email = req.user?.email;
  const cart = await cartService.getCartByEmail(email as string);

  const cartItems: CartItem[] = cart?.cartItems as CartItem[];
  //console.log(cartItems, "cartItems");

  const productIds = cartItems.map((cartItem) => cartItem.productId);
  //console.log(productIds);
  const cartProducts = await productService.getProductbyIds(productIds);
  //delete cartProducts[0].colors
  // console.log(cartProducts);

  res.status(httpStatus.OK).json({
    success: true,
    cartProducts,
    cartItems,
  });
});

const addToCart: RequestHandler = catchAsync(async (req, res, next) => {
  const email = req.user?.email as string;
  const productId: MongooseId = req.params.productId;
  const amount: number = req.body.amount;
  const color: string = req.body.color;
  console.log("amount", amount);

  const isProductInCart = await cartService.isProductInCart(email, productId);
  // console.log(isProductInCart, "isProductInCart");

  if (isProductInCart) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product is already in the cart"
    );
  }

  await cartService.addToCart({ amount, email, productId, color });

  res.status(httpStatus.OK).json({
    success: true,
  });
});

const updateCart: RequestHandler = catchAsync(async (req, res, next) => {
  const productId: MongooseId = req.params.productId;
  const email = req.user?.email as string;

  const { amount }: { amount: number } = req.body;

  const updatedCart = await cartService.updateCart({
    amount,
    email,
    productId,
  });

  res.status(httpStatus.OK).json({
    success: true,
    cart: updatedCart,
  });
});

const deleteCartItems: RequestHandler = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const email = req.user?.email;
  const updatedCart = await cartService.deleteCartItem(
    productId,
    email as string
  );

  res.status(httpStatus.OK).json({
    success: true,
    updateCart,
  });
});

const emptyCart: RequestHandler = catchAsync(async (req, res, next) => {
  const email = req.user?.email as string;
  const cart = await cartService.emptyCart(email);
  console.log(cart);

  res.status(httpStatus.OK).json({
    success: true,
  });
});

const getCartItems: RequestHandler = catchAsync(async (req, res, next) => {});

export {
  addToCart,
  updateCart,
  getCartItems,
  getCartProducts,
  deleteCartItems,
  emptyCart,
};

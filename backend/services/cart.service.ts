import { Cart } from "../models";
import { MongooseId } from "../utils/types";

interface PropType {
  amount: number;
  email: string;
  productId: MongooseId;
  color?: string;
}

const updateCart = ({ amount, email, productId }: PropType) => {
  return Cart.updateOne(
    { email: email, "cartItems.productId": productId },
    { $inc: { "cartItems.$.quantity": amount } }
  );
};

const createCart = (email: string) => {
  return Cart.create({ email: email, cartItems: [] });
};

const addToCart = ({ amount, email, productId, color }: PropType) => {
  return Cart.updateOne(
    { email: email },
    {
      $push: {
        cartItems: {
          productId: productId,
          quantity: amount,
          color: color,
        },
      },
    }
  );
};

const getCartByEmail = async (email: string) => {
  return Cart.findOne({ email: email });
};

const deleteCartItem = (productId: MongooseId, email: string) => {
  return Cart.updateOne(
    { email: email },
    { $pull: { cartItems: { productId: productId } } }
  );
};

const isProductInCart = (email: string, productId: MongooseId) => {
  return Cart.findOne({
    email: email,
    "cartItems.productId": productId,
  });
};

const emptyCart = (email: string) => {
  return Cart.updateOne(
    { email: email },
    { $set: { cartItems: [] } },
    { new: true }
  );
};
export {
  updateCart,
  createCart,
  addToCart,
  getCartByEmail,
  deleteCartItem,
  isProductInCart,
  emptyCart,
};

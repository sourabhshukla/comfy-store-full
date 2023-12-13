import { Types } from "mongoose";
import { Order } from "../models";
import { MongooseId } from "../utils/types";
import { productService } from ".";

const createOrder = ({
  address,
  city,
  pincode,
  orderItems,
  phoneNumber,
  shipping,
  tax,
  cartTotal,
  orderTotal,
  user,
}: {
  address: string;
  city: string;
  pincode: number;
  orderItems: object[];
  phoneNumber: number;
  shipping: number;
  tax: number;
  cartTotal: number;
  orderTotal: number;
  user: MongooseId;
}) => {
  return Order.create({
    address,
    city,
    pincode,
    orderItems,
    phoneNumber,
    shipping,
    tax,
    cartTotal,
    orderTotal,
    user,
  });
};

const getOrders = (
  pageNumber: number,
  userId: MongooseId,
  ordersPerPage = 10
) => {
  return Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * ordersPerPage)
    .limit(ordersPerPage);
};

const getTotalOrders = () => {
  return Order.countDocuments();
};

export { createOrder, getOrders, getTotalOrders };

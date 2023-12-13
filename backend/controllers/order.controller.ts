import { RequestHandler } from "express";
import catchAsync from "../utils/catchAsync";
import { orderService, productService } from "../services";
import { MongooseId } from "../utils/types";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

const checkout: RequestHandler = catchAsync(async (req, res) => {
  const {
    address,
    city,
    pincode,
    orderItems,
    phoneNumber,
    shipping,
    tax,
    cartTotal,
    orderTotal,
  }: {
    address: string;
    city: string;
    pincode: number;
    orderItems: any;
    phoneNumber: number;
    shipping: number;
    tax: number;
    cartTotal: number;
    orderTotal: number;
  } = req.body;
  const user = req.user?._id as MongooseId;
  // console.log("1");
  console.log(orderItems);
  await productService.decreaseProductCount(orderItems);
  // console.log("2");
  const order = await orderService.createOrder({
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
  //console.log("3");
  res.status(httpStatus.CREATED).json({
    success: true,
    order,
  });
});

const getAllOrders: RequestHandler = catchAsync(async (req, res) => {
  const query = productService.queryBuilder(req.query);
  const userId = req?.user?._id;
  if (!userId) throw new ApiError(httpStatus.BAD_REQUEST, "user not found");
  console.log(query);
  let currPage: number = parseInt(req.query.page as string);
  //console.log(currPage);
  if (isNaN(currPage)) {
    currPage = 1;
  }
  const ordersPerPage = 10;
  const orders = await orderService.getOrders(currPage, userId);
  const totalOrders = await orderService.getTotalOrders();
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  res.status(httpStatus.OK).json({
    success: true,
    orders,
    currPage,
    totalOrders,
    totalPages,
  });
});
export { checkout, getAllOrders };

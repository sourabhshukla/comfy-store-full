import { NextFunction, Request, RequestHandler, Response } from "express";
import { Product } from "../models";
import catchAsync from "../utils/catchAsync";
import { UploadedFile } from "express-fileupload";
import { cloudinaryService, productService } from "../services";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { ProductModel } from "../models/product.model";
import { MongooseId } from "../utils/types";
import { Types } from "mongoose";

interface Avatar {
  public_id: string;
  url: string;
}

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let images: UploadedFile[] = [];

    // If there is only one Image
    if (typeof req.files?.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.files?.images as UploadedFile[];
    }

    const imageLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinaryService.uploadProductImage(images[i]);

      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imageLinks;

    const product = await productService.createProduct(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      product,
    });
  }
);

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  // const { featured } = req.query;
  // if (featured) {
  //   const featuredProducts = await productService.getFeaturedProducts();
  //   res.status(200).json({
  //     success: true,
  //     products: featuredProducts,
  //   });
  // }

  console.log(req.query);

  const query = productService.queryBuilder(req.query);
  console.log(query);
  let currPage: number = parseInt(req.query.page as string);
  //console.log(currPage);
  if (isNaN(currPage)) {
    currPage = 1;
  }

  const productsPerPage = 10;

  const sortedProducts = await productService.sortAndPaginateProducts(
    query,
    req.query.order as string,
    currPage,
    productsPerPage
  );
  const queriedProducts = await productService.queriedProducts(query);
  const totalProducts = queriedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  //const products = await productService.getAllProducts();

  const categories = ["all", "Tables", "Chairs", "Kids", "Sofas", "Beds"];
  const companies = [
    "all",
    "Modenza",
    "Luxora",
    "Artifex",
    "Comfora",
    "Homestead",
  ];

  res.status(httpStatus.OK).json({
    success: true,
    products: sortedProducts,
    totalProducts,
    currPage,
    totalPages,
    productsPerPage,
    categories,
    companies,
  });
});

const getAdminProducts: RequestHandler = catchAsync(async (req, res, next) => {
  const products = await productService.getAllProducts();

  res.status(httpStatus.OK).json({
    success: true,
    products,
  });
});

const getProductDetails: RequestHandler = catchAsync(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);

  if (!product) {
    return next(new ApiError(httpStatus.NOT_FOUND, "Product Not Found"));
  }

  res.status(httpStatus.OK).json({
    success: true,
    product,
  });
});

const updateProduct: RequestHandler = catchAsync(async (req, res, next) => {
  let product = await productService.getProductById(req.params.id);

  if (!product) {
    return next(new ApiError(httpStatus.NOT_FOUND, "Product Not Found"));
  }

  let images: UploadedFile[] = [];

  if (typeof req.files?.images === "string") {
    images.push(req.files?.images);
  } else {
    images = req.files?.images as UploadedFile[];
  }

  if (images) {
    product.images.forEach(async (image) => {
      let imageId = image.public_id;
      const result = await cloudinaryService.destroyImage(imageId);
    });

    const imageLinks: Avatar[] = [];

    images.forEach(async (image) => {
      const result = await cloudinaryService.uploadProductImage(image);

      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    });
    req.body.images = imageLinks;
  }

  product = await productService.updateById(req.params.id, req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

const deleteProduct: RequestHandler = catchAsync(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);

  if (!product) {
    return next(new ApiError(httpStatus.NOT_FOUND, "Product not found"));
  }

  product.images.forEach(async (image) => {
    await cloudinaryService.destroyImage(image.public_id);
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Product deleted successfully",
  });
});

interface uploadData {
  title: string;
  company: string;
  description: string;
  featured: boolean;
  category: string;
  image: string;
  price: string;
  shipping: boolean;
  colors: string[];
}

const uploadData: RequestHandler = catchAsync(async (req, res, next) => {
  console.log("ere");
  console.log(req);
  const data: uploadData = req.body;
  //console.log(data);
  await Product.create(data);
  res.status(201).json({
    success: true,
  });
});

interface Review {
  userId: Types.ObjectId;
  username: string;
  rating: number;
  comment: string;
}

const createProductReview: RequestHandler = catchAsync(
  async (req, res, next) => {
    const {
      rating,
      comment,
      productId,
    }: { rating: string; comment: string; productId: MongooseId } = req.body;

    const review = {
      userId: req.user?._id,
      username: req.user?.username as string,
      rating: Number(rating) as number,
      comment: comment as string,
    };

    const product = await productService.getProductById(productId);

    const isReviewed = product?.reviews.find(
      (rev) => rev.userId?.toString() === req.user?._id.toString()
    );

    if (isReviewed) {
      product?.reviews.forEach((rev) => {
        // console.log(rev.userId.toString());
        // console.log(req.user._id.toString());
        if (rev.userId?.toString() === req.user?._id.toString()) {
          rev.rating = Number(rating);
          rev.comment = comment;
        }
      });
    } else {
      //product?.reviews;
      product?.reviews.push(review as any);
    }
  }
);

export {
  getAllProducts,
  getAdminProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  uploadData,
};

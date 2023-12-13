import httpStatus from "http-status";
import { Product } from "../models";
import { ProductModel } from "../models/product.model";
import ApiError from "../utils/ApiError";
import { MongooseId } from "../utils/types";

interface Query {
  featured?: boolean;
  search?: boolean;
  category?: string;
  company?: string;
  order?: string;
  price?: number;
  shipping?: string;
}

interface OrderItem {
  productId: MongooseId;
  quantity: number;
  price: number;
  color: string;
}

const createProduct = (product: ProductModel) => {
  return Product.create(product);
};

const queryBuilder = ({
  featured,
  search,
  category,
  company,
  price,
  shipping,
}: Query) => {
  let query = {};
  if (featured) {
    query = { ...query, featured: featured };
  }
  if (search) {
    console.log("jere");
    query = { ...query, title: { $regex: search, $options: "i" } };
  }
  if (category && category !== "all") {
    query = { ...query, category: category };
  }
  if (company && company !== "all") {
    query = { ...query, company: company };
  }
  if (price) {
    query = { ...query, price: { $lt: price } };
  }
  if (shipping) {
    query = { ...query, shipping: true };
  }
  return query;
};

const queriedProducts = (query: object) => {
  return Product.find({ ...query });
};

const sortAndPaginateProducts = (
  query: object,
  sortBy?: string,
  pageNumber = 1,
  productsPerPage = 10
) => {
  if (sortBy) {
    if (sortBy === "a-z") {
      return Product.find({ ...query })
        .sort({ title: 1 })
        .skip((pageNumber - 1) * productsPerPage)
        .limit(productsPerPage);
    } else if (sortBy === "z-a") {
      return Product.find({ ...query })
        .sort({ title: -1 })
        .skip((pageNumber - 1) * productsPerPage)
        .limit(productsPerPage);
    } else if (sortBy === "high") {
      return Product.find({ ...query })
        .sort({ price: -1 })
        .skip((pageNumber - 1) * productsPerPage)
        .limit(productsPerPage);
    } else if (sortBy === "low") {
      return Product.find({ ...query })
        .sort({ price: 1 })
        .skip((pageNumber - 1) * productsPerPage)
        .limit(productsPerPage);
    }
  }
  return Product.find({ ...query })
    .skip((pageNumber - 1) * productsPerPage)
    .limit(productsPerPage);
};

const getFeaturedProducts = () => {
  return Product.find({ featured: true });
};

const getAllProducts = () => {
  return Product.find();
};

const getProductById = (id: MongooseId) => {
  return Product.findById(id);
};

const getProductbyIds = (products: MongooseId[]) => {
  return Product.find({ _id: { $in: products } });
};

const updateById = (id: MongooseId, product: ProductModel) => {
  const options = {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  };

  return Product.findByIdAndUpdate(id, product, options);
};

const getDocumentsCount = () => {
  return Product.countDocuments();
};

const decreaseProductCount = async (orderItems: OrderItem[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const product = await Product.findById(orderItems[i].productId);
    if (product && product.stock < orderItems[i].quantity) {
      throw new ApiError(httpStatus.OK, "Stock not available");
    }
    await Product.findOneAndUpdate(
      { _id: orderItems[i].productId, stock: { $gte: orderItems[i].quantity } },
      { $inc: { stock: -orderItems[i].quantity } },
      { new: true }
    );
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateById,
  getFeaturedProducts,
  queryBuilder,
  sortAndPaginateProducts,
  getProductbyIds,
  getDocumentsCount,
  queriedProducts,
  decreaseProductCount,
};

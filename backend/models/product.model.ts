import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const productSchema = new Schema({
  title: {
    type: String,
    required: [true, "PLease Enter product name"],
    trim: true,
  },
  company: {
    type: String,
    required: [true, "Please Enter Product's Company"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  shipping: {
    type: Boolean,
    default: false,
  },
  colors: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: [true, "Please Enter product description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [5, "Price cannot exceed 8 characters"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "PLease Enter Product Category"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Ptoduct Stock"],
    maxLength: [3, "Stock cannot exceed 3 characters"],
    default: 5,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface ProductModel extends InferSchemaType<typeof productSchema> {
  _id: Types.ObjectId;
}

export { productSchema };

//export type Product = InferSchemaType<typeof productSchema>;

//module.exports = mongoose.model("Product", productSchema);
// const userModel = mongoose.model("Product", productSchema);
// export { userModel };

export default mongoose.model<ProductModel>("Product", productSchema);

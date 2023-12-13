import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const orderSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  cartTotal: {
    type: Number,
    required: true,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  orderItems: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface OrderModel extends InferSchemaType<typeof orderSchema> {
  _id: Types.ObjectId;
}

export default mongoose.model<OrderModel>("Order", orderSchema);

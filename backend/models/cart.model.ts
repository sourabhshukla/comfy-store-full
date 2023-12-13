import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const cartSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please provide email of the customer"],
    unique: true,
  },
  cartItems: [
    {
      productId: {
        type: Types.ObjectId,
      },
      color: {
        type: String,
        required: true,
      },
      quantity: Number,
    },
  ],
});

export type CartModel2 = InferSchemaType<typeof cartSchema>;

export interface CartModel extends InferSchemaType<typeof cartSchema> {
  _id: Types.ObjectId;
}

export default mongoose.model<CartModel>("Cart", cartSchema);

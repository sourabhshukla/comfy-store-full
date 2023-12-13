import { Form, redirect } from "react-router-dom";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import axios from "axios";
import { toast } from "react-toastify";
import { clearCart } from "../features/cart/cartSlice";
import { emptyCart } from "../features/user/userSlice";
import { productionUrl } from "../utils/index";

export const action =
  (store) =>
  async ({ request }) => {
    console.log(store);
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    if (data.phoneNumber < Math.pow(10, 9)) {
      toast.warning("Phone number should be of 10 digits");
      return null;
    }
    const cartState = store.getState().cartState;
    const userState = store.getState().userState;
    const { cartTotal, shipping, tax, orderTotal } = store.getState().cartState;
    data.cartTotal = cartTotal;
    data.shipping = shipping;
    data.tax = tax;
    data.orderTotal = orderTotal;
    const token = userState.token;
    const dispatch = store.dispatch;
    const orderItems = cartState.cartItems.map((item) => {
      return {
        quantity: item.amount,
        productName: item.title,
        color: item.color,
        productId: item._id,
        price: item.price,
      };
    });
    console.log(orderItems, "orderItems");
    console.log(data, cartState);

    try {
      const response = await axios.post(
        `${productionUrl}/api/v1/order`,

        {
          ...data,
          orderItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.delete(`${productionUrl}/api/v1/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(emptyCart());
      dispatch(clearCart());

      console.log(response.data);
      toast.success("Order placed Successfully");
      return redirect("/");
    } catch (error) {
      console.log(error);
      const errorMessage = error?.response?.data?.message || "Order Failed";
      toast.error(errorMessage);
    }

    return null;
  };

const CheckoutForm = () => {
  return (
    <Form method="POST" className="flex flex-col gap-y-4">
      <h4 className="font-medium text-xl capitalize">shipping information</h4>
      <FormInput label="address" name="address" type="text" />
      <FormInput label="city" name="city" type="text" />
      <FormInput label="pincode" name="pincode" type="number" />
      <FormInput label="phone number" name="phoneNumber" type="number" />
      <div className="mt-4">
        <SubmitBtn text="Continue" />
      </div>
    </Form>
  );
};

export default CheckoutForm;

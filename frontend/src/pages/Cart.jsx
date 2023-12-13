import { useSelector } from "react-redux";
import { SectionTitle, CartItemsList, CartTotals } from "../components";
import { Link, redirect, useLoaderData } from "react-router-dom";
import axios from "axios";
import { addItem } from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import { productionUrl } from "../utils";

export const loader =
  (store) =>
  async ({ params }) => {
    //const response = await customFetch(`/products/${params.id}`);
    const userState = store.getState().userState;
    const cartState = store.getState().cartState;
    const token = userState.token;
    //if(!userState.user)
    const dispatch = store.dispatch;
    try {
      const response = await axios.get(`${productionUrl}/api/v1/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cartItems = [];
      //console.log(response.data.cartItems.length, "carffff");
      for (let i = 0; i < response.data.cartItems.length; i++) {
        cartItems.push({
          ...response.data.cartProducts[i],
          color: response.data.cartItems[i].color,
          amount: response.data.cartItems[i].quantity,
          productId: response.data.cartItems[i].productId,
        });
      }
      //console.log(cartItems, "cartItems");
      if (cartState.cartItems.length === 0) {
        cartItems.forEach((product) => {
          // console.log(product);
          dispatch(addItem({ product, noToast: true }));
        });
      }
      //console.log(response.data.cartProducts);
      return {
        cartItems,
      };
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        "Please double check your credentials";
      toast.error(errorMessage);
      return redirect("/login");
    }
    return null;
  };

const Cart = () => {
  const user = null;
  const { cartItems } = useLoaderData();
  //console.log(cartItems);
  const numItemsInCart = useSelector((state) => state.cartState.numItemsInCart);

  if (numItemsInCart === 0) {
    return <SectionTitle text="Your Cart Is Empty" />;
  }
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <CartItemsList />
      </div>
      <div className="lg:col-span-4 lg:pl-4">
        <CartTotals />

        <Link to="/checkout" className="btn btn-primary btn-block mt-8">
          Proceed to Checkout{" "}
        </Link>
      </div>
    </div>
  );
};

export default Cart;

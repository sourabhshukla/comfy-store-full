import axios from "axios";
import { redirect, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { OrdersList, PaginationContainer, SectionTitle } from "../components";
import { productionUrl } from "../utils";

export const loader =
  (store) =>
  async ({ request }) => {
    const user = store.getState().userState;

    if (!user) {
      toast.warn("You must be logged in to view orders");
      return redirect("/login");
    }

    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    try {
      const response = await axios.get(`${productionUrl}/api/v1/order`, {
        params,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        "There was some error fetching your orders";
      toast.error(errorMessage);
    }
    return null;
  };

const Orders = () => {
  const { orders } = useLoaderData();

  if (orders.length === 0) {
    return <SectionTitle text="Please make an order" />;
  }
  return (
    <>
      <SectionTitle text="Your Orders" />
      <OrdersList />
      <PaginationContainer />
    </>
  );
};

export default Orders;

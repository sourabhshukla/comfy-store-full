import { useSelector } from "react-redux";
import { CartTotals, SectionTitle } from "../components";
import CheckoutForm from "../components/CheckoutForm";

export const loader = (store) => () => {
  return null;
};

const Checkout = () => {
  const cartTotal = useSelector((state) => state.userState.cartCount);

  if (cartTotal === 0) {
    return <SectionTitle text="Your cart is empty" />;
  }

  return (
    <>
      <SectionTitle text="Enter Shipping Information" />
      <div className="mt-8 grid gap-8 md:grid-cols-2 items-start">
        <CheckoutForm />
        <CartTotals />
      </div>
    </>
  );
};

export default Checkout;

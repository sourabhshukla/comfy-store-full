import { BsPlusLg } from "react-icons/bs";
import { formatPrice, productionUrl } from "../utils";
import { BiMinus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { editItem, removeItem } from "../features/cart/cartSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { decreaseCartItems } from "../features/user/userSlice";

const CartItem = ({ cartItem }) => {
  const { _id, title, price, images, amount, company, color } = cartItem;
  console.log("sdf", amount);
  const token = useSelector((state) => state.userState.token);
  console.log(cartItem, "images");
  // console.log("token", token);

  const [quantity, setQuantity] = useState(amount);

  const dispatch = useDispatch();

  const removeItemFromTheCart = () => {
    axios
      .delete(`${productionUrl}/api/v1/cart/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(removeItem({ _id }));
        dispatch(decreaseCartItems());
      });
  };

  const increaseAmount = () => {
    setQuantity((prev) => {
      axios
        .put(
          `${productionUrl}/api/v1/cart/${_id}`,
          { amount: 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => dispatch(editItem({ _id, amount: prev + 1 })));
      return prev + 1;
    });
    // dispatch(editItem({ cartID, amount: quantity }));
  };

  const decreaseAmount = () => {
    if (quantity === 1) {
      removeItemFromTheCart();
    } else {
      console.log("cartid", _id);
      setQuantity((prev) => {
        axios
          .put(
            `${productionUrl}/api/v1/cart/${_id}`,
            { amount: -1 },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => dispatch(editItem({ _id, amount: prev - 1 })));
        return prev - 1;
      });
      //dispatch(editItem({ cartID, amount: quantity }));
    }
  };

  // useEffect(() => {
  //   if (quantity) dispatch(editItem({ cartID, amount: quantity }));
  // }, [quantity, dispatch, cartID]);

  return (
    <article
      key={_id}
      className="mb-12 flex flex-col gap-y-4 sm:flex-row flex-wrap border-b border-base-300 pb-6 last:border-b-0"
    >
      <img
        src={images && images[0].url}
        alt={title}
        className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover"
      />
      <div className="sm:ml-12 sm:w-48">
        <h3 className="capitalize font-medium">{title}</h3>
        <h4 className="mt-2 capitalize text-sm text-neutral-content">
          {company}
        </h4>
        <p className="mt-4 text-sm capitalize flex items-center gap-x-2">
          color :{" "}
          <span
            className="badge badge-sm"
            style={{ backgroundColor: color }}
          ></span>
        </p>
      </div>

      <div className="sm:ml-12">
        <div className="mt-2 gap-x-4 flex items-center">
          <button className="btn btn-square" onClick={increaseAmount}>
            <BsPlusLg />
          </button>
          <span>{quantity}</span>
          <button className="btn btn-square" onClick={decreaseAmount}>
            <BiMinus />
          </button>
        </div>
        {/* <button className="mt-2 link link-primary link-hover text-sm">
          remove
        </button> */}
      </div>
      <div className="font-medium sm:ml-auto">{formatPrice(price)}</div>
    </article>
  );
};

export default CartItem;

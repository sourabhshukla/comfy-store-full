import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { formatPrice, productionUrl } from "../utils";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../features/cart/cartSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { increaseCartItems, logoutUser } from "../features/user/userSlice";

export const loader = async ({ params }) => {
  //const response = await customFetch(`/products/${params.id}`);
  const response = await axios.get(
    `${productionUrl}/api/v1/products/${params.id}`
  );
  return { product: response.data.product };
};

const SingleProduct = () => {
  const { product } = useLoaderData();
  console.log(product, "product");
  const token = useSelector((state) => state.userState.token);
  const { images, title, price, description, colors, company, stock, _id } =
    product;
  const dollarsAmount = formatPrice(price);
  const [productColor, setProductColor] = useState(colors[0]);
  const [amount, setAmount] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  const handleAmount = (e) => {
    setAmount(parseInt(e.target.value));
  };

  const increaseAmount = (e) => {
    setAmount((prev) => {
      if (prev === stock) {
        toast.error("Product Amount Can't Exceed Available Stock");
        return prev;
      }
      return prev + 1;
    });
  };

  const decreaseAmount = (e) => {
    setAmount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const cartProduct = {
    color: productColor,
    _id: _id,
    images: images,
    title,
    price,
    company,
    amount,
  };

  const dispatch = useDispatch();

  const addToCart = async () => {
    console.log(token);
    if (!token) {
      toast.error("Please Login to Add Product to the cart");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${productionUrl}/api/v1/cart/${_id}`,
        {
          amount,
          color: productColor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        "Please double check your credentials";
      console.log(errorMessage);
      if (errorMessage === "Json Web Token is expired, Try again") {
        navigate("/login");
        localStorage.removeItem("token");
        dispatch(logoutUser());
      }
      toast.error(errorMessage);
      return;
    }
    // toast.success("Product Added Successfully");
    dispatch(addItem({ product: { ...product, color: productColor, amount } }));
    dispatch(increaseCartItems());
  };

  return (
    <section>
      <div className="text-md breadcrumbs">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </div>

      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        <img
          src={images[0].url}
          alt={title}
          className="w-96 h-96 object-cover rounded-lg lg:w-full"
        />
        <div>
          <h1 className="capitalize text-3xl font-bold">{title}</h1>
          <h4 className="text-xl text-neutral-content font-bold mt-2">
            {company}
          </h4>
          <p className="mt-3 text-xl">{dollarsAmount}</p>
          <p className="mt-6 leading-8">{description}</p>
          <div className="mt-6">
            <h4 className="text-md font-medium tracking-wider">colors</h4>
            <div className="mt-2">
              {colors.map((color) => {
                return (
                  <button
                    key={color}
                    type="button"
                    className={`badge w-6 h-6 mr-2 ${
                      color === productColor && "border-2 border-secondary"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setProductColor(color)}
                  ></button>
                );
              })}
            </div>
            <div className="mt-2 gap-x-4 flex items-center">
              <button className="btn btn-square" onClick={increaseAmount}>
                <BsPlusLg />
              </button>
              <span>{amount}</span>
              <button className="btn btn-square" onClick={decreaseAmount}>
                <BiMinus />
              </button>
            </div>
            <div className="mt-12">
              {stock > 0 ? (
                !isAddingToCart ? (
                  <button
                    className="btn btn-secondary btn-md"
                    onClick={addToCart}
                  >
                    Add To Cart
                  </button>
                ) : (
                  <button className="btn btn-primary" disabled={true}>
                    <span className="loading loading-spinner"></span>
                    Adding...
                  </button>
                )
              ) : (
                <p className="text-2xl font-semibold text-red-500">
                  Out Of Stock
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;

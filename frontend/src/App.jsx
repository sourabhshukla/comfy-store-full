import {
  About,
  Cart,
  Checkout,
  Error,
  HomeLayout,
  Landing,
  Login,
  Orders,
  Products,
  Register,
  SingleProduct,
} from "./pages";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  ErrorElement,
  UpdatePassword,
  UpdateProfile,
  ResetPassword,
} from "./components";

//loaders
import { loader as landingLoader } from "./pages/Landing";
import { loader as singleProductLoader } from "./pages/SingleProduct";
import { loader as productsLoader } from "./pages/Products";
import { loader as checkoutLoader } from "./pages/Checkout";
import { loader as cartLoader } from "./pages/Cart";
import { loader as ordersLoader } from "./pages/Orders";

//actions
import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as checkoutAction } from "./components/CheckoutForm";
import { action as updateProfileAction } from "./components/UpdateProfile";
import { action as updatePasswordAction } from "./components/UpdatePassword";
import { action as resetPasswordAction } from "./components/ResetPassword";
import ForgotPassword, {
  action as forgotPasswordAction,
} from "./components/ForgotPassword";

import { store } from "./store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorElement />,
        loader: landingLoader,
      },
      {
        path: "products",
        element: <Products />,
        errorElement: <ErrorElement />,
        loader: productsLoader,
      },
      {
        path: "products/:id",
        element: <SingleProduct />,
        errorElement: <ErrorElement />,
        loader: singleProductLoader,
      },
      {
        path: "cart",
        element: <Cart />,
        loader: cartLoader(store),
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "checkout",
        element: <Checkout />,
        loader: checkoutLoader("sdf"),
        action: checkoutAction(store),
      },
      {
        path: "orders",
        element: <Orders />,
        loader: ordersLoader(store),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <Error />,
    action: registerAction,
  },
  {
    path: "/me/update",
    element: <UpdateProfile />,
    errorElement: <Error />,
    action: updateProfileAction(store),
  },
  {
    path: "/update/password",
    element: <UpdatePassword />,
    errorElement: <Error />,
    action: updatePasswordAction,
  },
  {
    path: "/reset/password/:token",
    element: <ResetPassword />,
    errorElement: <Error />,
    action: resetPasswordAction,
  },
  {
    path: "/forgot/password/",
    element: <ForgotPassword />,
    errorElement: <Error />,
    action: forgotPasswordAction,
  },
]);

const App = () => {
  const [theme, setTheme] = useState(
    useSelector((state) => state.userState.theme)
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);
  return <RouterProvider router={router} />;
};

export default App;

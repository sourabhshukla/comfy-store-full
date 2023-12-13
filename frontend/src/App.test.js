import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import userReducer from "./features/user/userSlice";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { Header } from "./components";
import "jest-localstorage-mock";
import { HomeLayout } from "./pages";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

test("test header component", () => {
  const store = configureStore({
    reducer: {
      cartState: cartReducer,
      userState: userReducer,
    },
  });

  const routes = [
    {
      path: "/",
      element: <HomeLayout />,
    },
  ];

  const router = createMemoryRouter(routes);
  render(
    <Provider store={store}>
      {/* <Header /> */}
      <RouterProvider router={router} />
    </Provider>
  );

  //   const ele = screen.getByText(/sign in/i);

  // console.log(ele);
});

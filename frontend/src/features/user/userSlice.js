import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const themes = {
  winter: "winter",
  dracula: "dracula",
};

const getThemesFormLocalStorage = () => {
  const theme = localStorage.getItem("theme") || themes.winter;
  console.log(theme);

  return theme;
};

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

const initialState = {
  user: null,
  theme: getThemesFormLocalStorage(),
  token: getTokenFromLocalStorage(),
  avatar: null,
  cartCount: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const { user, token, cart } = action.payload;
      console.log(action.payload);
      state.user = user;
      state.token = token;
      state.avatar = user.avatar?.url;
      state.cartCount = cart.cartItems.length;
      localStorage.setItem("token", token);
    },
    emptyCart: (state) => {
      state.cartCount = 0;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.avatar = null;
      state.cartCount = 0;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logged out Successfully");
    },
    increaseCartItems: (state) => {
      state.cartCount += 1;
    },
    decreaseCartItems: (state) => {
      state.cartCount -= 1;
    },
    getUser: (state, action) => {
      const { user, token, cartItems } = action.payload;
      console.log(action.payload);
      state.user = user;
      state.token = token;
      state.avatar = user.avatar?.url;
      state.cartCount = cartItems?.length || 0;
      localStorage.setItem("token", token);
    },
    toggleTheme: (state) => {
      const { dracula, winter } = themes;
      state.theme = state.theme === dracula ? winter : dracula;
      document.documentElement.setAttribute("data-theme", state.theme);
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const {
  loginUser,
  logoutUser,
  toggleTheme,
  getUser,
  increaseCartItems,
  decreaseCartItems,
  emptyCart,
} = userSlice.actions;

export default userSlice.reducer;

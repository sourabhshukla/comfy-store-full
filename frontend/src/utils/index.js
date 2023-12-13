import axios from "axios";

export const productionUrl = "https://comfy-backend.onrender.com";

// export const customFetch = axios.create({
//   baseURL: productionUrl,
// });

export const formatPrice = (price) => {
  const dollarAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((price / 100).toFixed(2));
  return dollarAmount;
};

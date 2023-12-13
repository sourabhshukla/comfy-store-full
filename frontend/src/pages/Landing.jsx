import axios from "axios";
import { FeaturedProducts, Hero } from "../components";
import { productionUrl } from "../utils";

const url = "/products?featured=true";

export const loader = async () => {
  // const response = await customFetch(url);
  const response = await axios.get(
    `${productionUrl}/api/v1/products?featured=true`
  );
  //console.log(response.data);
  const products = response.data.products;
  console.log({ products });
  return { products };
};

const Landing = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  );
};

export default Landing;

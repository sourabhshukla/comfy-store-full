import axios from "axios";
import { Filters, PaginationContainer, ProductsContainer } from "../components";
import { productionUrl } from "../utils";

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  console.log(params);
  //const response = await customFetch(url, { params });
  const response = await axios.get(`${productionUrl}/api/v1/products`, {
    params,
  });
  //console.log(response);
  console.log(response.data);
  const products = response.data.products;
  const currPage = response.data.currPage;
  const totalProducts = response.data.totalProducts;
  const totalPages = response.data.totalPages;
  const productsPerPage = response.data.productsPerPage;
  const categories = response.data.categories;
  const companies = response.data.companies;
  // const meta = response.data.meta;

  return {
    products,
    currPage,
    totalProducts,
    totalPages,
    productsPerPage,
    params,
    categories,
    companies,
  };
};

const Products = () => {
  return (
    <>
      <Filters />
      <ProductsContainer />
      <PaginationContainer />
    </>
  );
};

export default Products;

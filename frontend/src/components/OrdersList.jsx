import { useLoaderData } from "react-router-dom";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { formatPrice } from "../utils";
day.extend(advancedFormat);

const OrdersList = () => {
  const { orders } = useLoaderData();

  return (
    <div className="mt-8">
      <h4 className="mb-4 capitalize">total orders: {orders.length}</h4>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Order Id</th>
              <th>Address</th>
              <th>Products</th>
              <th>Cost</th>
              <th className="hidden sm:block">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const {
                _id: id,
                orderItems,
                address,
                orderTotal,
                createdAt,
              } = order;
              const date = day(createdAt).format("hh:mm a - MMM Do, YYYY");
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{address}</td>
                  <td>{orderItems.length}</td>
                  <td>{formatPrice(orderTotal)}</td>
                  <td className="hidden sm:block">{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;

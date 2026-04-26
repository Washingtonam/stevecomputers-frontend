import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api";
import { formatNaira } from "../lib/currency";

const formatOrderDate = (value) =>
  new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700"
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;

    let ignore = false;

    const loadOrders = async () => {
      try {
        const res = await fetch(apiUrl("/api/orders/my-orders"), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!ignore && res.ok) {
          setOrders(data);
        }
      } catch (error) {
        if (!ignore) console.error(error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      ignore = true;
    };
  }, [token]);

  if (!token) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">My Orders</h1>
        <p className="mb-4 text-gray-600">
          Please log in to view your order history.
        </p>
        <Link
          to="/login"
          className="bg-black text-white px-4 py-2 rounded inline-block"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        My Orders
      </h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-3">You have not placed any orders yet.</p>
          <Link
            to="/products"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >

              {/* TOP */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">

                <div>
                  <p className="font-semibold">
                    Order #{order.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatOrderDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">

                  {/* STATUS */}
                  <span className={`px-3 py-1 text-xs rounded font-semibold capitalize ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>

                  {/* PAYMENT */}
                  <span className={`text-xs px-3 py-1 rounded font-semibold ${
                    order.isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>

                  {/* TOTAL */}
                  <span className="font-bold">
                    {formatNaira(order.totalAmount)}
                  </span>

                </div>
              </div>

              {/* ITEMS PREVIEW */}
              <div className="text-sm text-gray-700 mb-3">
                {order.items.slice(0, 2).map((item) => (
                  <p key={item._id}>
                    {item.product?.name || "Product"} x {item.quantity}
                  </p>
                ))}

                {order.items.length > 2 && (
                  <p className="text-gray-400 text-xs">
                    +{order.items.length - 2} more items
                  </p>
                )}
              </div>

              {/* DELIVERY */}
              <div className="text-xs text-gray-500 mb-4">
                <p>Delivery: {order.deliveryMethod}</p>
                <p>Payment: {order.paymentMethod}</p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">

                {/* VIEW DETAILS */}
                <Link
                  to={`/orders/${order._id}`}
                  className="bg-black text-white px-4 py-2 text-sm rounded"
                >
                  View Details
                </Link>

                {/* WHATSAPP */}
                <a
                  href={`https://wa.me/2348129097599?text=${encodeURIComponent(
                    `Hello, I want to ask about my order (${order.orderId}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 text-sm rounded"
                >
                  Contact Support
                </a>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default MyOrders;
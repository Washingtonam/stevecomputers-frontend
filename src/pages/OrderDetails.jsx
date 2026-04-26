import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { apiUrl } from "../lib/api";
import { formatNaira } from "../lib/currency";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl(`/api/orders/${id}`), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!order) {
    return <p className="p-6">Order not found</p>;
  }

  const getStatusSteps = () => {
    const steps = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = steps.indexOf(order.status);

    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex
    }));
  };

  const handleReorder = () => {
    navigate("/");
  };

  const message = `
Hello, I'm checking my order.

Order ID: ${order.orderId}
Status: ${order.status}
  `;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm">

        {/* HEADER */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">
            Order #{order.orderId}
          </h1>

          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>

          <div className="flex gap-3 mt-3">
            <span className="px-3 py-1 text-xs bg-black text-white rounded">
              {order.status}
            </span>

            <span className={`px-3 py-1 text-xs rounded ${
              order.isPaid
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}>
              {order.isPaid ? "Paid" : "Not Paid"}
            </span>
          </div>

          <p className="text-lg font-bold mt-3">
            {formatNaira(order.totalAmount)}
          </p>
        </div>

        {/* TRACKING */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Order Progress</h2>

          <div className="flex justify-between text-xs">
            {getStatusSteps().map((step) => (
              <div key={step.name} className="text-center flex-1">
                <div
                  className={`w-6 h-6 mx-auto mb-1 rounded-full ${
                    step.completed ? "bg-black" : "bg-gray-300"
                  }`}
                ></div>
                <p className={`capitalize ${
                  step.completed ? "text-black" : "text-gray-400"
                }`}>
                  {step.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ITEMS */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Items</h2>

          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm border-b pb-2"
              >
                <span>
                  {item.product?.name || "Product"} x {item.quantity}
                </span>

                <span>
                  {formatNaira(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DELIVERY */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Delivery Info</h2>

          <p className="text-sm">
            Method: {order.deliveryMethod}
          </p>

          {order.address && (
            <p className="text-sm">
              Address: {order.address}, {order.city}, {order.state}
            </p>
          )}
        </div>

        {/* PAYMENT */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Payment</h2>

          <p className="text-sm">
            Method: {order.paymentMethod}
          </p>

          <p className="text-sm">
            Status: {order.isPaid ? "Paid" : "Pending"}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row gap-3">

          <a
            href={`https://wa.me/2348129097599?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-4 py-2 rounded text-center"
          >
            Contact Support
          </a>

          <button
            onClick={handleReorder}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Buy Again
          </button>

          <button
            onClick={() => window.print()}
            className="border px-4 py-2 rounded"
          >
            Print Receipt
          </button>

        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
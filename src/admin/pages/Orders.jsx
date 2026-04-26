import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiUrl } from "../../lib/api";
import { formatNaira } from "../../lib/currency";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(apiUrl("/api/orders/admin"), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(data);
      } else {
        alert("Failed to load orders");
      }

    } catch (error) {
      console.error(error);
      alert("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "confirmed":
        return "bg-blue-100 text-blue-600";
      case "shipped":
        return "bg-purple-100 text-purple-600";
      case "delivered":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex-1 p-6">

      <h1 className="text-2xl font-bold mb-6">
        Orders Management
      </h1>

      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <p>No orders available</p>
      )}

      {!loading && (
        <div className="space-y-4">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold">
                    Order #{order.orderId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.user?.name || "Customer"}
                  </p>
                </div>

                <span className="font-bold text-sm">
                  {formatNaira(order.totalAmount)}
                </span>
              </div>

              {/* STATUS */}
              <div className="flex justify-between items-center">

                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>

                <button
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="text-sm bg-black text-white px-3 py-1 rounded"
                >
                  View Details
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Orders;
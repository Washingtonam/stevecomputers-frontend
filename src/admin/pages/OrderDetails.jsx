import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { apiUrl } from "../../lib/api";
import { formatNaira } from "../../lib/currency";

const OrderDetails = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await fetch(apiUrl(`/api/orders/${id}`), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setOrder(data);
      } else {
        alert(data.message || "Failed to load order");
      }

    } catch (err) {
      console.error(err);
      alert("Error loading order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const res = await fetch(apiUrl(`/api/orders/${order._id}/status`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      fetchOrder();

    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  const markAsPaid = async () => {
    try {
      const res = await fetch(apiUrl(`/api/orders/${order._id}/pay`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to mark as paid");
      }

      fetchOrder();

    } catch (err) {
      console.error(err);
      alert("Payment update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700"
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Order Details
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* ===== TOP SUMMARY ===== */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-semibold">{order.orderId}</p>
          </div>

          <div className={`px-3 py-1 rounded text-sm font-semibold capitalize ${statusColors[order.status]}`}>
            {order.status}
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment</p>
            <p className={`font-semibold ${order.isPaid ? "text-green-600" : "text-red-500"}`}>
              {order.isPaid ? "Paid" : "Pending"}
            </p>
          </div>

          <div className="font-bold text-lg">
            {formatNaira(order.totalAmount)}
          </div>
        </div>

        {/* ===== CUSTOMER ===== */}
        <div>
          <h2 className="font-semibold mb-2">Customer Info</h2>
          <p>Name: {order.customerName || order.user?.name}</p>
          <p>Phone: {order.phone || "N/A"}</p>
          <p>Email: {order.user?.email || "N/A"}</p>
          <p>
            Address: {order.address}, {order.city}, {order.state}
          </p>
        </div>

        {/* ===== ITEMS ===== */}
        <div>
          <h2 className="font-semibold mb-2">Items</h2>

          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between border-b pb-2 text-sm">
                <div>
                  <p className="font-medium">
                    {item.product?.name || "Product"}
                  </p>
                  <p className="text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="font-semibold">
                  {formatNaira(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DELIVERY ===== */}
        <div>
          <h2 className="font-semibold mb-2">Delivery</h2>
          <p>Method: {order.deliveryMethod}</p>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex flex-wrap gap-3 pt-4">

          {/* STATUS */}
          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          {/* MARK PAID */}
          {!order.isPaid && (
            <button
              onClick={markAsPaid}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Mark as Paid
            </button>
          )}

          {/* WHATSAPP */}
          <a
            href={`https://wa.me/${order.phone}?text=${encodeURIComponent(
              `Hello ${order.customerName || ""}, your order (${order.orderId}) is currently ${order.status}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            WhatsApp Customer
          </a>

          {/* CALL */}
          {order.phone && (
            <a
              href={`tel:${order.phone}`}
              className="border px-4 py-2 rounded"
            >
              Call Customer
            </a>
          )}

          {/* PRINT */}
          <button
            onClick={() => window.print()}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Print Invoice
          </button>

        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
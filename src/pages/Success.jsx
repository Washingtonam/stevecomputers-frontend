import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { apiUrl } from "../lib/api";
import { formatNaira } from "../lib/currency";

const Success = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const reference = new URLSearchParams(location.search).get("reference");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Processing payment...");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!reference) {
      setStatus("Invalid payment reference");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(apiUrl(`/api/orders/verify/${reference}`));
        const data = await res.json();

        if (data.order) {
          setOrder(data.order);
          setStatus("Payment successful!");
          clearCart();
        } else {
          setStatus("Payment verification failed.");
        }
      } catch (error) {
        console.error(error);
        setStatus("Error verifying payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, clearCart]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">

      <div className="bg-white rounded-xl shadow-sm max-w-lg w-full p-6">

        {/* ================= STATUS ================= */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {loading ? "Processing..." : status}
          </h1>

          {!loading && order && (
            <p className="text-sm text-gray-500">
              Thank you for shopping with Steve Computer Warehouse
            </p>
          )}
        </div>

        {/* ================= ORDER DETAILS ================= */}
        {!loading && order && (
          <div className="mb-6 border rounded-lg p-4 bg-gray-50">

            <p className="text-sm mb-2">
              <span className="font-semibold">Order ID:</span> {order.orderId}
            </p>

            <p className="text-sm mb-2">
              <span className="font-semibold">Payment:</span>{" "}
              {order.isPaid ? "Paid" : "Pending"}
            </p>

            <p className="text-sm mb-2">
              <span className="font-semibold">Delivery:</span>{" "}
              {order.deliveryMethod}
            </p>

            {/* ITEMS */}
            <div className="mt-3">
              <p className="font-semibold text-sm mb-2">Items:</p>

              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>
                    {item.product?.name || "Product"} x {item.quantity}
                  </span>
                  <span>
                    {formatNaira(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-3 pt-3 font-bold text-sm">
              Total: {formatNaira(order.totalAmount)}
            </div>

          </div>
        )}

        {/* ================= NEXT STEPS ================= */}
        {!loading && order && (
          <div className="text-sm text-gray-600 mb-6 space-y-1">
            <p>📦 Your order is being processed</p>
            <p>📞 We may contact you for confirmation</p>
            <p>🚚 Delivery typically takes 1–3 days</p>
          </div>
        )}

        {/* ================= ACTIONS ================= */}
        <div className="flex flex-col gap-3">

          <button
            onClick={() => navigate("/")}
            className="bg-black text-white py-2 rounded"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="border py-2 rounded"
          >
            View My Orders
          </button>

          {/* WHATSAPP */}
          {order && (
            <a
              href={`https://wa.me/2348129097599?text=${encodeURIComponent(
                `Hello, I placed an order (${order.orderId}). I need assistance.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white py-2 rounded text-center"
            >
              Contact Support (WhatsApp)
            </a>
          )}

        </div>

      </div>

    </div>
  );
};

export default Success;
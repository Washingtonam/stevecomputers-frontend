import { useState, useEffect } from "react";
import { useCart } from "../context/cart-context";
import { apiUrl } from "../lib/api";
import { formatNaira } from "../lib/currency";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const token = localStorage.getItem("token");

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("online");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    state: "",
    city: ""
  });

  const [deliveryFees, setDeliveryFees] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [loading, setLoading] = useState(false);

  // ================= FETCH DELIVERY FEES =================
  useEffect(() => {
    fetch(apiUrl("/api/delivery"))
      .then(res => res.json())
      .then((data) => {
        // 🔥 Safety: ensure it's always an array
        if (Array.isArray(data)) {
          setDeliveryFees(data);
        } else {
          setDeliveryFees([]);
        }
      })
      .catch(() => setDeliveryFees([]));
  }, []);

  // ================= UPDATE DELIVERY FEE =================
  useEffect(() => {
    if (deliveryMethod !== "delivery") {
      setDeliveryFee(0);
      return;
    }

    if (!form.state || deliveryFees.length === 0) {
      setDeliveryFee(0);
      return;
    }

    const match = deliveryFees.find(
      (d) =>
        d.state &&
        d.state.toLowerCase().trim() === form.state.toLowerCase().trim()
    );

    setDeliveryFee(match ? Number(match.fee) : 5000); // fallback
  }, [form.state, deliveryMethod, deliveryFees]);

  if (!token) {
    return <p className="p-6 text-center">Please login to continue</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal + deliveryFee;

  // ================= PLACE ORDER =================
  const handleCheckout = async () => {
    if (!form.name || !form.phone) {
      return alert("Name and phone are required");
    }

    try {
      setLoading(true);

      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity
        })),
        deliveryMethod,
        paymentMethod,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        state: form.state,
        city: form.city
      };

      const res = await fetch(apiUrl("/api/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      // ================= PAYSTACK =================
      if (paymentMethod === "online" && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      // ================= WHATSAPP =================
      const message = `
Hello, I want to place an order:

Name: ${form.name}
Phone: ${form.phone}

Items:
${cart.map((i) => `- ${i.name} x ${i.quantity}`).join("\n")}

Subtotal: ${formatNaira(subtotal)}
Delivery Fee: ${formatNaira(deliveryFee)}
Total: ${formatNaira(total)}

Delivery: ${deliveryMethod}
Address: ${form.address}, ${form.city}, ${form.state}
      `;

      const phone = "2348129097599";
      window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      clearCart();

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <p className="p-6 text-center">Cart is empty</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* ================= LEFT ================= */}
        <div className="bg-white p-6 rounded-xl shadow-sm">

          <h2 className="text-lg font-semibold mb-4">Customer Info</h2>

          <input
            name="name"
            placeholder="Full Name"
            className="border p-2 w-full mb-3"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className="border p-2 w-full mb-3"
            onChange={handleChange}
          />

          {/* DELIVERY */}
          <label className="font-semibold text-sm">Delivery Method</label>
          <select
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value)}
            className="border p-2 w-full mb-3"
          >
            <option value="delivery">Delivery</option>
            <option value="pickup">Pickup</option>
          </select>

          {deliveryMethod === "delivery" && (
            <>
              <input
                name="address"
                placeholder="Address"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
              />

              <input
                name="state"
                placeholder="State (e.g. Edo, Lagos)"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
              />

              <input
                name="city"
                placeholder="City"
                className="border p-2 w-full mb-4"
                onChange={handleChange}
              />
            </>
          )}

          {/* PAYMENT */}
          <label className="font-semibold text-sm">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="online">Pay Online (Paystack)</option>
            <option value="cod">Pay on Delivery / WhatsApp</option>
          </select>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-white p-6 rounded-xl shadow-sm h-fit">

          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          {cart.map((item) => {
            const price = item.discountPrice || item.price;

            return (
              <div key={item._id} className="flex justify-between mb-2 text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatNaira(price * item.quantity)}</span>
              </div>
            );
          })}

          <div className="border-t mt-3 pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatNaira(deliveryFee)}</span>
            </div>

            <div className="flex justify-between font-bold text-base mt-2">
              <span>Total</span>
              <span>{formatNaira(total)}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-3 space-y-1">
            <p>✅ Secure checkout</p>
            <p>🚚 Fast delivery</p>
            <p>📞 Support available</p>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-black text-white w-full py-2 mt-4 rounded"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
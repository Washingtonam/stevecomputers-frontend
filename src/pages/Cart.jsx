import { Link } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { formatNaira } from "../lib/currency";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        🛒 Your Cart
      </h1>

      {/* EMPTY STATE */}
      {cart.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-500 mb-4">
            Your cart is empty
          </p>

          <Link to="/">
            <button className="bg-black text-white px-6 py-2 rounded">
              Start Shopping
            </button>
          </Link>
        </div>
      )}

      {/* CART CONTENT */}
      {cart.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">

          {/* ================= LEFT (ITEMS) ================= */}
          <div className="md:col-span-2 space-y-4">

            {cart.map((item) => {
              const price = item.discountPrice || item.price;

              return (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-xl shadow-sm border flex gap-4"
                >
                  {/* IMAGE */}
                  <img
                    src={item.images?.[0]}
                    className="w-20 h-20 object-cover rounded"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-sm">
                      {item.name}
                    </h2>

                    <p className="text-green-600 font-bold">
                      {formatNaira(price)}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-2 mt-2">

                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>

                      <span className="text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>

                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 text-xs mt-2"
                    >
                      Remove
                    </button>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="font-semibold text-sm">
                    {formatNaira(price * item.quantity)}
                  </div>
                </div>
              );
            })}

          </div>

          {/* ================= RIGHT (SUMMARY) ================= */}
          <div className="bg-white p-5 rounded-xl shadow-sm border h-fit">

            <h2 className="font-semibold mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between text-sm mb-2">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>{formatNaira(totalPrice)}</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span>Delivery</span>
              <span className="text-gray-400">Calculated at checkout</span>
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>{formatNaira(totalPrice)}</span>
            </div>

            <Link to="/checkout">
              <button className="w-full bg-green-600 text-white py-2 rounded font-semibold">
                Proceed to Checkout
              </button>
            </Link>

            {/* TRUST */}
            <p className="text-xs text-gray-400 mt-3 text-center">
              Secure checkout • Fast delivery • Trusted service
            </p>

          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { apiUrl } from "../lib/api";
import { formatNaira } from "../lib/currency";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetch(apiUrl(`/api/products/${id}`))
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setActiveImage(data.images?.[0] || "");

        // 🔥 fetch related (same category)
        if (data.category) {
          fetch(apiUrl(`/api/products?category=${data.category}&limit=5`))
            .then((res) => res.json())
            .then((r) => {
              const items = r.products || r;
              setRelated(items.filter((p) => p._id !== data._id).slice(0, 4));
            });
        }
      })
      .catch(console.error);
  }, [id]);

  if (!product) return <p className="p-6">Loading...</p>;

  const price = product.discountPrice || product.price;
  const imageGallery = product.images?.filter(Boolean) || [];

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate("/cart");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      <div className="max-w-6xl mx-auto">

        {/* ================= MAIN ================= */}
        <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-sm">

          {/* LEFT - IMAGES */}
          <div>
            {activeImage ? (
              <img
                src={activeImage}
                className="w-full h-80 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-80 bg-gray-100 rounded flex items-center justify-center">
                No image
              </div>
            )}

            {imageGallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {imageGallery.map((img) => (
                  <img
                    key={img}
                    src={img}
                    onClick={() => setActiveImage(img)}
                    className={`h-20 w-full object-cover rounded cursor-pointer border ${
                      activeImage === img ? "border-black" : ""
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - INFO */}
          <div>

            <p className="text-sm text-gray-500 mb-2">
              {product.category}
            </p>

            <h1 className="text-2xl font-bold mb-3">
              {product.name}
            </h1>

            <p className="text-2xl text-green-600 font-bold mb-4">
              {formatNaira(price)}
            </p>

            {/* STOCK */}
            <p className="mb-4">
              {product.stock > 5 && (
                <span className="text-green-600 text-sm">In stock</span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="text-orange-500 text-sm">
                  Low stock ({product.stock})
                </span>
              )}
              {product.stock === 0 && (
                <span className="text-red-600 text-sm">Out of stock</span>
              )}
            </p>

            {/* QUANTITY */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 border rounded"
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="bg-black text-white px-5 py-2 rounded"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-green-600 text-white px-5 py-2 rounded"
              >
                Buy Now
              </button>

              <a
                href={`https://wa.me/2348129097599?text=${encodeURIComponent(
                  `Hello, I want to order ${product.name} for ${formatNaira(price)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-5 py-2 rounded"
              >
                WhatsApp
              </a>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-gray-600 text-sm">
                {product.description || "No description available"}
              </p>
            </div>

            {/* TRUST */}
            <div className="text-sm text-gray-500 space-y-1">
              <p>✅ Secure checkout</p>
              <p>🚚 Fast delivery nationwide</p>
              <p>📞 Customer support available</p>
            </div>

          </div>
        </div>

        {/* ================= RELATED ================= */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">
              Related Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((item) => (
                <div key={item._id} className="bg-white p-3 rounded shadow-sm border">

                  <img
                    src={item.images?.[0]}
                    className="h-32 w-full object-cover rounded mb-2"
                  />

                  <p className="text-sm font-semibold truncate">
                    {item.name}
                  </p>

                  <p className="text-green-600 font-bold text-sm">
                    {formatNaira(item.price)}
                  </p>

                  <Link to={`/product/${item._id}`}>
                    <button className="w-full mt-2 text-xs bg-black text-white py-1 rounded">
                      View
                    </button>
                  </Link>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
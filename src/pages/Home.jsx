import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api";
import { formatNaira } from "../lib/currency";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);

  const touchStartX = useRef(0);

  const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl("/api/products"));
      const data = await res.json();

      if (res.ok) {
        const all = Array.isArray(data.products) ? data.products : data;
        const randomized = shuffle(all);
        setProducts(randomized.slice(0, 12));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= AUTO SLIDE =================
  useEffect(() => {
    if (pause || products.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [pause, products]);

  // ================= LOOP FIX =================
  useEffect(() => {
    if (index >= products.length) {
      setIndex(0);
    }
  }, [index, products.length]);

  const loopProducts = [...products, ...products];
  const visibleProducts = loopProducts.slice(index, index + 5);

  const featured = products.slice(0, 6);

  // ================= ARROWS =================
  const nextSlide = () => setIndex((prev) => prev + 1);
  const prevSlide = () =>
    setIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));

  // ================= MOBILE SWIPE =================
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  };

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-700 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Your Trusted Tech Store & Service Hub
        </h1>
        <p className="text-gray-200 mb-6">
          Gadgets • Repairs • Installations • Training
        </p>

        <div className="flex justify-center gap-3">
          <Link to="/products">
            <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:scale-105 transition">
              Shop Now
            </button>
          </Link>

          <a href="https://wa.me/2348179736442">
            <button className="border border-white px-6 py-2 rounded hover:bg-white hover:text-black transition">
              Contact Us
            </button>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* ================= TRENDING SLIDER ================= */}
        {!loading && visibleProducts.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6">🔥 Trending Now</h2>

            <div
              className="relative"
              onMouseEnter={() => setPause(true)}
              onMouseLeave={() => setPause(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* ARROWS */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow px-3 py-2 rounded-full z-10"
              >
                ←
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow px-3 py-2 rounded-full z-10"
              >
                →
              </button>

              <div className="overflow-hidden">
                <div className="flex gap-4 transition-all duration-700 ease-in-out">

                  {visibleProducts.map((product, i) => {
                    const price = product.discountPrice || product.price;

                    return (
                      <div
                        key={i}
                        className="min-w-[160px] md:min-w-[200px] bg-white p-3 rounded-xl shadow-sm hover:shadow-lg transition"
                      >
                        <img
                          src={product.images?.[0]}
                          className="w-full h-28 object-cover rounded mb-2"
                        />

                        <p className="text-xs font-semibold truncate">
                          {product.name}
                        </p>

                        <p className="text-green-600 text-sm font-bold">
                          {formatNaira(price)}
                        </p>
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>
          </>
        )}

        
        {/* ================= SERVICES ================= */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold mb-6">🛠 Our Services</h2>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              { title: "POS Installation", link: "/services/pos" },
              { title: "CCTV Setup", link: "/services/cctv" },
              { title: "Device Repairs", link: "/services/repairs" },
              { title: "Training", link: "/services/training" }
            ].map((s, i) => (
              <Link key={i} to={s.link}>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-center cursor-pointer">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-xs text-gray-500 mt-2">
                    Click to learn more →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ================= ABOUT ================= */}
        <div className="mb-16 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">🏢 About Us</h2>

          <p className="text-gray-600 mb-4">
            Steve Computer Warehouse is a trusted tech hub in Benin City,
            providing reliable gadgets, repairs, and installation services.
          </p>

          <p className="text-gray-600 mb-6">
            With multiple branches and experienced technicians, we deliver
            quality service you can trust.
          </p>

          <Link to="/about">
            <button className="bg-blue-600 text-white px-5 py-2 rounded">
              Learn More
            </button>
          </Link>
        </div>

      </div>

      {/* ================= FEATURED ================= */}
        {!loading && featured.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 mt-10">🔥 Featured Products</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
              {featured.map((product) => {
                const price = product.discountPrice || product.price;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition"
                  >
                    <img
                      src={product.images?.[0]}
                      className="w-full h-28 object-cover rounded mb-2"
                    />

                    <p className="text-xs font-semibold truncate">
                      {product.name}
                    </p>

                    <p className="text-green-600 text-sm font-bold">
                      {formatNaira(price)}
                    </p>

                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 text-xs bg-slate-900 text-white py-1 rounded"
                      >
                        Add
                      </button>

                      <Link to={`/product/${product._id}`} className="flex-1">
                        <button className="w-full text-xs border py-1 rounded">
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}


      

    </div>
  );
};

export default Home;
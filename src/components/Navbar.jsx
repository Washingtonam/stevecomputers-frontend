import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { useState } from "react";

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [showCategories, setShowCategories] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [search, setSearch] = useState("");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/products?search=${search}`);
    setSearch("");
  };

  const categories = ["Phones", "Accessories", "Gadgets", "Power Banks"];

  const services = [
    { name: "POS Installation", path: "/services/pos" },
    { name: "CCTV Installation", path: "/services/cctv" },
    { name: "Repairs", path: "/services/repairs" },
    { name: "Training", path: "/services/training" }
  ];

  return (
    <div className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">

      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-6">

        {/* LOGO */}
        <Link to="/" className="font-bold text-lg md:text-xl">
          Steve Computer Warehouse
        </Link>

        {/* CATEGORIES */}
        <div
          className="relative hidden md:block"
          onMouseEnter={() => setShowCategories(true)}
          onMouseLeave={() => setShowCategories(false)}
        >
          <button className="text-sm font-medium hover:text-blue-600">
            Categories ▾
          </button>

          {showCategories && (
            <div className="absolute top-7 left-0 bg-white border shadow-md rounded w-48 z-50">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SERVICES */}
        <div
          className="relative hidden md:block"
          onMouseEnter={() => setShowServices(true)}
          onMouseLeave={() => setShowServices(false)}
        >
          <button className="text-sm font-medium hover:text-blue-600">
            Services ▾
          </button>

          {showServices && (
            <div className="absolute top-7 left-0 bg-white border shadow-md rounded w-52 z-50">
              {services.map((s) => (
                <Link
                  key={s.name}
                  to={s.path}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ABOUT */}
        <Link to="/about" className="hidden md:block text-sm hover:text-blue-600">
          About
        </Link>

        {/* SHOP */}
        <Link to="/products" className="hidden md:block text-sm hover:text-blue-600">
          Shop
        </Link>

      </div>

      {/* ================= CENTER (SEARCH) ================= */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-l px-3 py-1.5 text-sm focus:outline-none"
        />
        <button className="bg-blue-600 text-white px-4 rounded-r text-sm">
          Search
        </button>
      </form>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-4 text-sm">

        {/* CART */}
        <Link to="/cart" className="relative text-lg">
          🛒

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>

        {!user ? (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <button className="font-medium hover:text-blue-600">
              {user.name?.split(" ")[0] || "Account"} ▾
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-7 bg-white border shadow-md rounded w-44 z-50">

                <Link
                  to="/orders"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  My Orders
                </Link>

                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 hover:bg-gray-100 font-semibold"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
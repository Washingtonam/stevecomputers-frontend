import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { useState } from "react";

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path) => location.pathname === path;

  const categories = ["Phones", "Accessories", "Gadgets", "Power Banks"];

  const services = [
    { name: "Business Software Setup", path: "/services/pos" },
    { name: "CCTV Installation", path: "/services/cctv" },
    { name: "Repairs", path: "/services/repairs" },
    { name: "Training", path: "/services/training" }
  ];

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">

      {/* LEFT */}
      <div className="flex items-center gap-6">

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
            <div className="absolute left-0 mt-2 bg-white border shadow-lg rounded w-48 z-50 animate-fadeIn">
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
            <div className="absolute left-0 mt-2 bg-white border shadow-lg rounded w-56 z-50 animate-fadeIn">
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

        <Link
          to="/products"
          className={`hidden md:block text-sm ${
            isActive("/products") ? "text-black font-semibold" : "hover:text-blue-600"
          }`}
        >
          Shop
        </Link>

        <Link
          to="/about"
          className={`hidden md:block text-sm ${
            isActive("/about") ? "text-black font-semibold" : "hover:text-blue-600"
          }`}
        >
          About
        </Link>

        <Link
          to="/contact"
          className={`hidden md:block text-sm ${
            isActive("/contact") ? "text-black font-semibold" : "hover:text-blue-600"
          }`}
        >
          Contact
        </Link>

      </div>

      {/* CENTER */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-l px-3 py-1.5 text-sm focus:outline-none shadow-sm"
        />
        <button className="bg-blue-600 text-white px-4 rounded-r text-sm">
          Search
        </button>
      </form>

      {/* RIGHT */}
      <div className="flex items-center gap-4 text-sm">

        <Link to="/cart" className="relative text-lg">
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>

        {!user ? (
          <div className="flex gap-3">
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="font-semibold hover:underline">
              Register
            </Link>
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <button className="font-medium hover:text-blue-600">
              Hi, {user.name?.split(" ")[0] || "User"} ▾
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded w-44 z-50 animate-fadeIn">

                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                  My Orders
                </Link>

                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>

                {(user.role === "admin" || user.role === "superadmin") && (
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
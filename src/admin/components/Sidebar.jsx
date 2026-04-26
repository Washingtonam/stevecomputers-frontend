import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const menu = [
    { name: "Dashboard", path: "/admin", icon: "🏠" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Orders", path: "/admin/orders", icon: "🧾" },
    { name: "Delivery", path: "/admin/delivery", icon: "🚚" } // 🔥 NEW
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col">

      {/* USER INFO */}
      <div className="p-5 border-b">
        <h2 className="text-lg font-bold text-gray-800">
          {user?.name || "Admin"}
        </h2>
        <p className="text-xs text-gray-500 capitalize">
          {user?.role || "admin"}
        </p>
      </div>

      {/* MENU */}
      <div className="flex-1 p-4 space-y-2">

        {menu.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}

      </div>

      {/* ACTIONS */}
      <div className="p-4 border-t space-y-3">

        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          ← Back to Store
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
        >
          ⏻ Logout
        </button>

        <p className="text-xs text-gray-400 text-center">
          © Admin System
        </p>

      </div>

    </div>
  );
};

export default Sidebar;
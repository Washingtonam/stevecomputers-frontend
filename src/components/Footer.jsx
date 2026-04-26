import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-10 text-sm">

      {/* ================= NEWSLETTER (REDUCED HEIGHT) ================= */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">

          <div>
            <h2 className="text-white font-semibold text-sm">
              Join Our Newsletter
            </h2>
            <p className="text-xs text-gray-400">
              Get exclusive deals & updates
            </p>
          </div>

          <div className="flex w-full md:w-auto">
            <input
              placeholder="Enter your email"
              className="p-2 text-black w-full md:w-56 text-xs rounded-l"
            />
            <button className="bg-green-600 px-3 text-xs rounded-r hover:bg-green-700">
              Subscribe
            </button>
          </div>

        </div>
      </div>

      {/* ================= MAIN FOOTER (COMPACT GRID) ================= */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">

        {/* BRAND */}
        <div>
          <h3 className="text-white font-semibold mb-2 text-sm">
            Steve Computer Warehouse
          </h3>

          <p className="text-xs text-gray-400 leading-snug">
            Gadgets • Repairs • Installations • Training
          </p>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="text-white font-semibold mb-2 text-sm">
            Shop
          </h3>

          <ul className="space-y-1 text-xs">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/products?category=accessories" className="hover:text-white">Accessories</Link></li>
            <li><Link to="/products?category=computers" className="hover:text-white">Computers</Link></li>
            <li><Link to="/products?filter=offers" className="hover:text-white">Special Offers</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-2 text-sm">
            Support
          </h3>

          <ul className="space-y-1 text-xs">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/returns" className="hover:text-white">Return Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* ACCOUNT + SOCIAL + TRUST */}
        <div>
          <h3 className="text-white font-semibold mb-2 text-sm">
            Account
          </h3>

          <ul className="space-y-1 text-xs mb-3">
            <li><Link to="/profile" className="hover:text-white">My Account</Link></li>
            <li><Link to="/orders" className="hover:text-white">Order History</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
          </ul>

          {/* SOCIAL MOVED HERE */}
          <div className="flex gap-3 text-sm mb-3">
            <a href="#" className="hover:scale-110 transition">📘</a>
            <a href="#" className="hover:scale-110 transition">📸</a>
            <a href="#" className="hover:scale-110 transition">🐦</a>
            <a href="#" className="hover:scale-110 transition">💼</a>
          </div>

          {/* TRUST */}
          <div className="text-xs text-gray-400 leading-snug">
            <p>Paystack • Visa • Mastercard</p>
            <p>Fast Nationwide Delivery</p>
          </div>
        </div>

      </div>

      {/* ================= BOTTOM ================= */}
      <div className="border-t border-gray-800 text-center py-3 text-xs text-gray-500">
        © {new Date().getFullYear()} Steve Computer Warehouse. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
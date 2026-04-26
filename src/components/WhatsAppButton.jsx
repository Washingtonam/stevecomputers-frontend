import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const location = useLocation();

  const phone = "2348129097599";

  const message = encodeURIComponent(
    "Hello, I want to make an inquiry about your products."
  );

  const [showPopup, setShowPopup] = useState(false);

  // ================= PAGE CONTROL =================
  const hideRoutes = [
    "/cart",
    "/checkout",
    "/login",
    "/register"
  ];

  const isAdmin = location.pathname.startsWith("/admin");
  const shouldHide = hideRoutes.includes(location.pathname);

  // ================= POPUP LOGIC =================
  useEffect(() => {
    if (isAdmin || shouldHide) return;

    const alreadyShown = sessionStorage.getItem("whatsapp_popup");

    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("whatsapp_popup", "true");
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="fixed bottom-20 right-5 bg-white shadow-xl rounded-xl p-4 w-72 border animate-fade-in z-50">
          
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-black"
          >
            ✕
          </button>

          <p className="text-sm text-gray-700 mb-3">
            Need help or want to place an order?
          </p>

          <a
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded"
          >
            Chat on WhatsApp
          </a>
        </div>
      )}

      {/* ================= FLOATING BUTTON ================= */}
      {!isAdmin && !shouldHide && (
        <a
          href={`https://wa.me/${phone}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 z-50"
        >
          💬 <span className="hidden md:inline">Chat Us</span>
        </a>
      )}
    </>
  );
};

export default WhatsAppButton;
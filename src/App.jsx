import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import WhatsAppButton from "./components/WhatsAppButton";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Success from "./pages/Success";
import MyOrders from "./pages/MyOrders";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";

import PosInstallation from "./pages/services/PosInstallation";
import CCTV from "./pages/services/CCTV";
import Repairs from "./pages/services/Repairs";
import Training from "./pages/services/Training";


// ✅ CUSTOMER ORDER DETAILS (🔥 ADD THIS)
import OrderDetailsPage from "./pages/OrderDetails";

// ADMIN
import AdminDashboard from "./admin/pages/Dashboard";
import AdminProducts from "./admin/pages/Products";
import AdminOrders from "./admin/pages/Orders";
import AddProduct from "./admin/pages/AddProduct";
import EditProduct from "./admin/pages/EditProduct";
import AdminLayout from "./admin/components/AdminLayout";
import OrderDetails from "./admin/pages/OrderDetails";
import Delivery from "./admin/pages/Delivery";
import Users from "./admin/pages/Users";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Toaster position="top-right" />

      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} /> {/* 🔥 FIX */}
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services/pos" element={<PosInstallation />} />
        <Route path="/services/cctv" element={<CCTV />} />
        <Route path="/services/repairs" element={<Repairs />} />
        <Route path="/services/training" element={<Training />} />


        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="delivery" element={<Delivery />} /> {/* 🔥 NEW */}
          <Route path="users" element={<Users />} />

          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
        </Route>
      </Routes>


      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </>
  );
}

export default App;
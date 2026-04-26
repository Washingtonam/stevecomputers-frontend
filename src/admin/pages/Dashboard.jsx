import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import SalesChart from "../components/SalesChart";
import TopProducts from "../components/TopProducts";
import LowStock from "../components/LowStock";
import { apiUrl } from "../../lib/api";
import { formatNaira } from "../../lib/currency";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const res = await fetch(apiUrl("/api/orders/analytics"), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of your store performance
          </p>
        </div>

        {/* ================= STATS ================= */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded shadow animate-pulse">
                <div className="h-3 bg-gray-200 mb-2"></div>
                <div className="h-6 bg-gray-200 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">

            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h2 className="text-xl font-bold">{stats?.totalOrders || 0}</h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-gray-500 text-sm">Revenue</p>
              <h2 className="text-xl font-bold">
                {formatNaira(stats?.totalRevenue || 0)}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-gray-500 text-sm">Pending</p>
              <h2 className="text-xl font-bold">
                {stats?.pendingOrders || 0}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-gray-500 text-sm">Delivered</p>
              <h2 className="text-xl font-bold">
                {stats?.deliveredOrders || 0}
              </h2>
            </div>

          </div>
        )}

        {/* ================= CHART + DATA ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h2 className="font-semibold mb-3">Sales Overview</h2>
            <SalesChart />
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h2 className="font-semibold mb-3">Top Products</h2>
            <TopProducts />
          </div>

        </div>

        {/* LOW STOCK */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="font-semibold mb-3">Low Stock Alert</h2>
          <LowStock />
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <Link to="/admin/products">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
              <h2 className="text-lg font-semibold mb-2">
                Manage Products
              </h2>
              <p className="text-gray-500 text-sm">
                Add, edit stock, categories and images.
              </p>
            </div>
          </Link>

          <Link to="/admin/orders">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
              <h2 className="text-lg font-semibold mb-2">
                View Orders
              </h2>
              <p className="text-gray-500 text-sm">
                Track and update order status.
              </p>
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
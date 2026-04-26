import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;
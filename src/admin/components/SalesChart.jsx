import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { apiUrl } from "../../lib/api";

const SalesChart = () => {
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(apiUrl("/api/orders/sales"), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setData(data));
  }, [token]);

  return (
    <div className="bg-white p-4 rounded shadow mt-8">

      <h2 className="text-lg font-semibold mb-4">
        Sales Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default SalesChart;

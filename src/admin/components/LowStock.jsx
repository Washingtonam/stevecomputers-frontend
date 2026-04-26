import { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";

const LowStock = () => {
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(apiUrl("/api/products/low-stock"), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [token]);

  return (
    <div className="bg-white p-4 rounded shadow mt-8">

      <h2 className="text-lg font-semibold mb-4 text-red-600">
        ⚠️ Low Stock Alerts
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">All products are well stocked</p>
      ) : (
        <div className="space-y-3">

          {products.map((p) => (
            <div
              key={p._id}
              className="flex justify-between border-b pb-2"
            >
              <span>{p.name}</span>
              <span className="text-red-600 font-bold">
                {p.stock} left
              </span>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default LowStock;

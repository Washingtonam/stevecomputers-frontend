import { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(apiUrl("/api/orders/top-products"), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [token]);

  return (
    <div className="bg-white p-4 rounded shadow mt-8">

      <h2 className="text-lg font-semibold mb-4">
        Top Selling Products
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No sales yet</p>
      ) : (
        <div className="space-y-3">

          {products.map((p, index) => (
            <div
              key={index}
              className="flex justify-between border-b pb-2"
            >
              <span>{p.name}</span>
              <span className="font-bold">{p.totalSold} sold</span>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default TopProducts;

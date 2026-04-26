import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiUrl } from "../lib/api";
import { formatNaira } from "../lib/currency";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pages, setPages] = useState(1);

  // ================= FETCH =================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        apiUrl(
          `/api/products?page=${page}&limit=10&search=${search}&category=${category}&stock=${stock}`
        )
      );

      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
        setPages(data.pages || 1);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchParams({ page });
    fetchProducts();
  }, [page, search, category, stock]);

  // ================= PAGINATION LOGIC =================
  const getPages = () => {
    const range = [];

    let start = Math.max(1, page - 2);
    let end = Math.min(pages, page + 2);

    if (page <= 3) {
      start = 1;
      end = Math.min(5, pages);
    }

    if (page >= pages - 2) {
      start = Math.max(1, pages - 4);
      end = pages;
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-6">
          All Products
        </h1>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-wrap gap-3">

          <input
            placeholder="Search products..."
            className="border p-2 flex-1 rounded"
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />

          <input
            placeholder="Category"
            className="border p-2 rounded"
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          />

          <select
            className="border p-2 rounded"
            onChange={(e) => {
              setPage(1);
              setStock(e.target.value);
            }}
          >
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
          </select>

        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading products...
          </p>
        )}

        {/* EMPTY */}
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500">
            No products found
          </p>
        )}

        {/* GRID */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

            {products.map((product) => {
              const price = product.discountPrice || product.price;

              return (
                <div key={product._id} className="bg-white rounded-xl p-3 shadow-sm border hover:shadow-md transition">

                  <div className="w-full h-32 overflow-hidden rounded mb-2">
                    <img
                      src={product.images?.[0]}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h2 className="text-sm font-semibold truncate">
                    {product.name}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {product.category}
                  </p>

                  <p className="text-green-600 font-bold">
                    {formatNaira(price)}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-black text-white text-xs py-1.5 rounded"
                    >
                      Add
                    </button>

                    <Link to={`/product/${product._id}`} className="flex-1">
                      <button className="w-full text-xs border py-1.5 rounded">
                        View
                      </button>
                    </Link>
                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* ================= SMART PAGINATION ================= */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-10">

          {/* FIRST */}
          {page > 1 && (
            <button
              onClick={() => setPage(1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              «
            </button>
          )}

          {/* PREV */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {/* LEFT DOT */}
          {page > 3 && <span>...</span>}

          {/* PAGE NUMBERS */}
          {getPages().map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                p === page
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}

          {/* RIGHT DOT */}
          {page < pages - 2 && <span>...</span>}

          {/* NEXT */}
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>

          {/* LAST */}
          {page < pages && (
            <button
              onClick={() => setPage(pages)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              »
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default Products;
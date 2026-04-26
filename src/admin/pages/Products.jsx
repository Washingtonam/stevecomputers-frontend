import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiUrl } from "../../lib/api";
import { formatNaira } from "../../lib/currency";
import toast from "react-hot-toast";

const createEmptyForm = () => ({
  name: "",
  price: "",
  description: "",
  category: "",
  stock: "0",
  images: []
});

const createEmptyEditForm = () => ({
  name: "",
  price: "",
  description: "",
  category: "",
  stock: "0",
  imageUrls: "",
  newImages: []
});



const parseImageUrls = (value) =>
  value.split(",").map((img) => img.trim()).filter(Boolean);

const uploadImages = async (files) => {
  const fileList = Array.from(files || []);

  return Promise.all(
    fileList.map(async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(apiUrl("/api/upload"), {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      return data.url;
    })
  );
};

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(createEmptyForm());
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(createEmptyEditForm());

  const [imageInputKey, setImageInputKey] = useState(0);
  const [file, setFile] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const [selected, setSelected] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // UX STATES
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        apiUrl(
          `/api/products?page=${currentPage}&limit=10&search=${search}&category=${categoryFilter}&stock=${stockFilter}`
        )
      );

      const data = await res.json();

      if (res.ok) {
        setProducts(Array.isArray(data.products) ? data.products : []);
        setTotalPages(data.pages || 1);
      } else {
        toast.error("Failed to load products");
      }

    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, categoryFilter, stockFilter]);

  // ================= SELECT =================
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === products.length) {
      setSelected([]);
    } else {
      setSelected(products.map((p) => p._id));
    }
  };

  // ================= BULK DELETE =================
  const handleBulkDelete = async () => {
    if (selected.length === 0) return toast.error("Select products");

    if (!confirm("Delete selected products?")) return;

    try {
      setIsDeleting(true);

      await fetch(apiUrl("/api/products/bulk-delete"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selected })
      });

      toast.success("Products deleted");
      setSelected([]);
      fetchProducts();

    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // ================= ADD =================
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const imageUrls = await uploadImages(form.images);

      await fetch(apiUrl("/api/products"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          images: imageUrls
        })
      });

      toast.success("Product added");
      setForm(createEmptyForm());
      setImageInputKey((k) => k + 1);
      fetchProducts();

    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      await fetch(apiUrl(`/api/products/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Deleted");
      fetchProducts();

    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= PAGINATION =================
  const getPageNumbers = () => {
    const pages = [];
    const range = 2;

    let start = Math.max(1, currentPage - range);
    let end = Math.min(totalPages, currentPage + range);

    if (currentPage <= 3) {
      end = Math.min(5, totalPages);
    }

    if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
  <div>

    {/* MAIN CONTENT */}
    <div className="flex-1 p-6">

      <h1 className="text-2xl font-bold mb-6">
        Product Management
      </h1>

        {/* SEARCH */}
        <div className="bg-white p-4 rounded shadow mb-6 flex gap-3 flex-wrap">
          <input placeholder="Search..." className="border p-2 flex-1"
            onChange={(e) => setSearch(e.target.value)}
          />

          <input placeholder="Category" className="border p-2"
            onChange={(e) => setCategoryFilter(e.target.value)}
          />

          <button
            onClick={() => navigate("/admin/products/new")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Add Product
          </button>

          <select className="border p-2" onChange={(e) => setStockFilter(e.target.value)}>
            <option value="">All</option>
            <option value="low">Low Stock</option>
            <option value="in">In Stock</option>
          </select>

          <button onClick={handleSelectAll} className="bg-gray-700 text-white px-3">
            Select All
          </button>

          <button
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white px-3"
          >
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </button>
        </div>

        {/* ================= LOADING SKELETON ================= */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white p-2 rounded shadow animate-pulse">
                <div className="w-full h-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 mb-1"></div>
                <div className="h-3 bg-gray-300 w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && products.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-gray-500 mb-3">No products found</p>
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("");
                setStockFilter("");
              }}
              className="bg-black text-white px-4 py-2"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ================= TABLE UI ================= */}
        {!loading && products.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border">

  {/* HEADER */}
  <div className="flex items-center justify-between p-4 border-b">
    <h2 className="font-semibold text-gray-800">
      Products
    </h2>

    <span className="text-sm text-gray-400">
      {products.length} items
    </span>
  </div>

  {/* TABLE */}
  <table className="w-full text-sm">

    {/* HEAD */}
    <thead className="text-gray-500 bg-gray-50">
      <tr>
        <th className="p-3">
          <input
            type="checkbox"
            checked={selected.length === products.length}
            onChange={handleSelectAll}
          />
        </th>
        <th className="p-3 text-left">Product</th>
        <th className="p-3 text-left">Category</th>
        <th className="p-3 text-left">Price</th>
        <th className="p-3 text-left">Stock</th>
        <th className="p-3 text-left">Action</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {products.map((p) => (
        <tr
          key={p._id}
          className="border-t hover:bg-gray-50 transition"
        >
          {/* CHECKBOX */}
          <td className="p-3">
            <input
              type="checkbox"
              checked={selected.includes(p._id)}
              onChange={() => toggleSelect(p._id)}
            />
          </td>

          {/* PRODUCT */}
          <td className="p-3 flex items-center gap-3">

            <img
              src={p.images?.[0]}
              className="w-10 h-10 object-cover rounded-md border"
            />

            <div>
              <p className="font-medium text-gray-800">
                {p.name}
              </p>
              <p className="text-xs text-gray-400 truncate max-w-[200px]">
                {p.description || "No description"}
              </p>
            </div>

          </td>

          {/* CATEGORY */}
          <td className="p-3 text-gray-600">
            {p.category || "—"}
          </td>

          {/* PRICE */}
          <td className="p-3 font-medium text-gray-800">
            {formatNaira(p.price)}
          </td>

          {/* STOCK */}
          <td className="p-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium
              ${
                p.stock <= 5
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {p.stock} units
            </span>
          </td>

          {/* ACTION */}
          <td className="p-3">
            <div className="flex gap-3 text-xs">
              <button onClick={() => navigate(`/admin/products/${p._id}/edit`)}>
                Edit
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 gap-2 flex-wrap items-center">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            First
          </button>

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                currentPage === num
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Last
          </button>

        </div>

      </div>
    </div>
  );
};

export default Products;
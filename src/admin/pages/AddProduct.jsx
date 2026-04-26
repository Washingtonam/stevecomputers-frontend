import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../lib/api";
import toast from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    images: []
  });

  const [preview, setPreview] = useState([]);
  const [excelPreview, setExcelPreview] = useState([]);
  const [excelFile, setExcelFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // ================= IMAGE HANDLER =================
  const handleImages = (files) => {
    const fileArray = Array.from(files);

    setForm({ ...form, images: fileArray });

    const previews = fileArray.map((file) =>
      URL.createObjectURL(file)
    );

    setPreview(previews);
  };

  // ================= REMOVE IMAGE =================
  const removeImage = (index) => {
    const newImages = [...form.images];
    const newPreview = [...preview];

    newImages.splice(index, 1);
    newPreview.splice(index, 1);

    setForm({ ...form, images: newImages });
    setPreview(newPreview);
  };

  // ================= CLOUD UPLOAD =================
  const uploadImages = async () => {
    try {
      setUploadingImages(true);

      const uploads = await Promise.all(
        form.images.map(async (file) => {
          const fd = new FormData();
          fd.append("image", file);

          const res = await fetch(apiUrl("/api/upload"), {
            method: "POST",
            body: fd
          });

          const data = await res.json();

          if (!data.url) throw new Error("Image upload failed");

          return data.url;
        })
      );

      return uploads;

    } finally {
      setUploadingImages(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      return toast.error("Name & price required");
    }

    try {
      setLoading(true);

      let imageUrls = [];

      if (form.images.length > 0) {
        imageUrls = await uploadImages();
      }

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

      toast.success("Product created successfully");

      navigate("/admin/products");

    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= EXCEL PREVIEW =================
  const handleExcelUpload = async () => {
    if (!excelFile) return toast.error("Select Excel file");

    const fd = new FormData();
    fd.append("file", excelFile);

    try {
      const res = await fetch(apiUrl("/api/products/preview-excel"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: fd
      });

      const data = await res.json();
      setExcelPreview(data);

    } catch {
      toast.error("Preview failed");
    }
  };

  // ================= CONFIRM EXCEL =================
  const confirmUpload = async () => {
    try {
      await fetch(apiUrl("/api/products/confirm-excel"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ products: excelPreview })
      });

      toast.success("Products uploaded");

      navigate("/admin/products");

    } catch {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Add Product
      </h1>

      {/* ================= SINGLE PRODUCT ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">

        <h2 className="font-semibold mb-4">
          Single Product
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Product Name"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Price"
            type="number"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            placeholder="Category"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            placeholder="Stock"
            type="number"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

        </div>

        <textarea
          placeholder="Description"
          className="border p-2 w-full mt-3 rounded"
          rows={3}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* ================= IMAGE ================= */}
        <div className="mt-4">
          <label className="text-sm font-medium">
            Upload Images
          </label>

          <input
            type="file"
            multiple
            className="mt-2"
            onChange={(e) => handleImages(e.target.files)}
          />
        </div>

        {/* ================= PREVIEW ================= */}
        {preview.length > 0 && (
          <div className="flex gap-3 mt-4 flex-wrap">

            {preview.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  className="w-20 h-20 object-cover rounded-lg border"
                />

                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-black text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}

          </div>
        )}

        {/* ================= BUTTON ================= */}
        <button
          onClick={handleSubmit}
          disabled={loading || uploadingImages}
          className="bg-black text-white px-6 py-2 mt-5 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? "Creating..."
            : uploadingImages
            ? "Uploading Images..."
            : "Create Product"}
        </button>

      </div>

      {/* ================= EXCEL ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">

        <h2 className="font-semibold mb-4">
          Bulk Upload (Excel)
        </h2>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setExcelFile(e.target.files[0])}
        />

        <button
          onClick={handleExcelUpload}
          className="bg-green-600 text-white px-5 py-2 mt-3 rounded-lg"
        >
          Preview Excel
        </button>

      </div>

      {/* ================= EXCEL PREVIEW ================= */}
      {excelPreview.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow mt-6">

          <h2 className="font-semibold mb-4">
            Preview Products
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Stock</th>
                </tr>
              </thead>

              <tbody>
                {excelPreview.map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.price}</td>
                    <td className="p-2">{p.category}</td>
                    <td className="p-2">{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={confirmUpload}
              className="bg-green-600 text-white px-5 py-2 rounded"
            >
              Confirm Upload
            </button>

            <button
              onClick={() => setExcelPreview([])}
              className="bg-gray-500 text-white px-5 py-2 rounded"
            >
              Cancel
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default AddProduct;
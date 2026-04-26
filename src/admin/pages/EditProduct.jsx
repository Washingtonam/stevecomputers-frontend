import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../lib/api";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    images: [],
    newImages: []
  });

  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(apiUrl(`/api/products/${id}`));
        const data = await res.json();

        if (res.ok) {
          setForm({
            ...data,
            newImages: []
          });

          setPreview(data.images || []);
        }
      } catch {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  // ================= ADD NEW IMAGES =================
  const handleNewImages = (files) => {
    const fileArray = Array.from(files);

    setForm((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...fileArray]
    }));

    const previews = fileArray.map((file) =>
      URL.createObjectURL(file)
    );

    setPreview((prev) => [...prev, ...previews]);
  };

  // ================= REMOVE IMAGE =================
  const removeImage = (index) => {
    const updatedPreview = [...preview];
    updatedPreview.splice(index, 1);

    // Remove from existing images if index is within existing
    if (index < form.images.length) {
      const updatedImages = [...form.images];
      updatedImages.splice(index, 1);

      setForm((prev) => ({
        ...prev,
        images: updatedImages
      }));
    } else {
      // Remove from new images
      const newIndex = index - form.images.length;
      const updatedNewImages = [...form.newImages];
      updatedNewImages.splice(newIndex, 1);

      setForm((prev) => ({
        ...prev,
        newImages: updatedNewImages
      }));
    }

    setPreview(updatedPreview);
  };

  // ================= UPLOAD NEW IMAGES =================
  const uploadImages = async () => {
    try {
      setUploadingImages(true);

      const uploads = await Promise.all(
        form.newImages.map(async (file) => {
          const fd = new FormData();
          fd.append("image", file);

          const res = await fetch(apiUrl("/api/upload"), {
            method: "POST",
            body: fd
          });

          const data = await res.json();

          if (!data.url) throw new Error("Upload failed");

          return data.url;
        })
      );

      return uploads;

    } finally {
      setUploadingImages(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      let uploaded = [];

      if (form.newImages.length > 0) {
        uploaded = await uploadImages();
      }

      const finalImages = [...form.images, ...uploaded];

      await fetch(apiUrl(`/api/products/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          images: finalImages
        })
      });

      toast.success("Product updated successfully");

      navigate("/admin/products");

    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Edit Product
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            value={form.name}
            placeholder="Product Name"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            value={form.price}
            type="number"
            placeholder="Price"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            value={form.category}
            placeholder="Category"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            value={form.stock}
            type="number"
            placeholder="Stock"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

        </div>

        <textarea
          value={form.description}
          placeholder="Description"
          className="border p-2 w-full mt-3 rounded"
          rows={3}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* ================= IMAGE PREVIEW ================= */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">
            Product Images
          </p>

          <div className="flex gap-3 flex-wrap">
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
        </div>

        {/* ================= ADD NEW ================= */}
        <input
          type="file"
          multiple
          className="mt-4"
          onChange={(e) => handleNewImages(e.target.files)}
        />

        {/* ================= BUTTON ================= */}
        <button
          onClick={handleUpdate}
          disabled={loading || uploadingImages}
          className="bg-black text-white px-6 py-2 mt-5 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : uploadingImages
            ? "Uploading Images..."
            : "Update Product"}
        </button>

      </div>

    </div>
  );
};

export default EditProduct;
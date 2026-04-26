import { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";

const Delivery = () => {
  const [fees, setFees] = useState([]);
  const [state, setState] = useState("");
  const [fee, setFee] = useState("");

  const token = localStorage.getItem("token");

  const fetchFees = async () => {
    const res = await fetch(apiUrl("/api/delivery"), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setFees(data);
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleAdd = async () => {
    await fetch(apiUrl("/api/delivery"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ state, fee })
    });

    setState("");
    setFee("");
    fetchFees();
  };

  const handleUpdate = async (id, newFee) => {
    await fetch(apiUrl(`/api/delivery/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ fee: newFee })
    });

    fetchFees();
  };

  const handleDelete = async (id) => {
    await fetch(apiUrl(`/api/delivery/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchFees();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Delivery Settings</h1>

      {/* ADD NEW */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-3">
        <input
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border p-2 flex-1"
        />

        <input
          placeholder="Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="border p-2 w-32"
        />

        <button
          onClick={handleAdd}
          className="bg-black text-white px-4"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded shadow">
        {fees.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{item.state}</span>

            <div className="flex gap-2 items-center">
              <input
                defaultValue={item.fee}
                onBlur={(e) => handleUpdate(item._id, e.target.value)}
                className="border p-1 w-24"
              />

              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Delivery;
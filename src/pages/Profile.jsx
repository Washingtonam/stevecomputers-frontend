import { useState } from "react";
import { apiUrl } from "../lib/api";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await fetch(apiUrl("/api/users/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Profile updated");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= CHANGE PASSWORD =================
  const handlePassword = async () => {
    try {
      setLoading(true);

      const res = await fetch(apiUrl("/api/users/password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Password updated");

      setOldPassword("");
      setNewPassword("");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="p-6 text-center">Please login</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* ================= PROFILE ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">

        <h2 className="font-semibold mb-4">Update Profile</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-3"
          placeholder="Name"
        />

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full mb-3"
          placeholder="Phone"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>

      </div>

      {/* ================= PASSWORD ================= */}
      <div className="bg-white p-6 rounded shadow">

        <h2 className="font-semibold mb-4">Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <button
          onClick={handlePassword}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Update Password
        </button>

      </div>

    </div>
  );
};

export default Profile;
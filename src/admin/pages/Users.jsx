import { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";

const user = JSON.parse(localStorage.getItem("user"));

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    const res = await fetch(apiUrl("/api/users"), {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id, role) => {
    await fetch(apiUrl(`/api/users/${id}/role`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });

    fetchUsers();
  };

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">Users</h1>

      <table className="w-full text-sm bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-3">{u.name}</td>
              <td>{u.email}</td>
              <td className="capitalize">{u.role}</td>

              <td className="flex gap-2 p-3">

                {user?.role === "superadmin" && u.role !== "superadmin" && (
                    <>
                    <button onClick={() => changeRole(u._id, "admin")}>
                        Make Admin
                    </button>

                    <button onClick={() => changeRole(u._id, "user")}>
                        Remove Admin
                    </button>
                    </>
                )}

                {u.role === "superadmin" && (
                    <span className="text-xs text-gray-400">Protected</span>
                )}

                </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Users;
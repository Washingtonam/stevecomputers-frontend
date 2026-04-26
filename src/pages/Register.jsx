import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created");
        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <input name="name" placeholder="Name" className="border p-2 w-full mb-2" onChange={handleChange} />
      <input name="email" placeholder="Email" className="border p-2 w-full mb-2" onChange={handleChange} />
      <input name="phone" placeholder="Phone" className="border p-2 w-full mb-2" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" className="border p-2 w-full mb-3" onChange={handleChange} />

      <button
        onClick={handleRegister}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Register
      </button>

    </div>
  );
};

export default Register;

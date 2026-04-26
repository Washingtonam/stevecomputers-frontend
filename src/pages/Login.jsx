import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Login successful");

        navigate("/");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p
        onClick={() => navigate("/register")}
        className="text-sm text-center mt-4 text-blue-600 cursor-pointer"
      >
        Don’t have an account? Register
      </p>

      <p className="text-sm text-center mt-2 text-gray-500 cursor-pointer">
        Forgot Password?
      </p>

    </div>
  );
};

export default Login;
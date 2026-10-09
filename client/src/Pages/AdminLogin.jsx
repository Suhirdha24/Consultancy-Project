import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../lib/api";

const AdminLogin = () => {
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setAdminCredentials({ ...adminCredentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await apiClient.post("/admin/login", adminCredentials);
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-5">Admin Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="text" name="username" placeholder="Username" onChange={handleInputChange} className="border p-2 w-full mb-3" />
        <input type="password" name="password" placeholder="Password" onChange={handleInputChange} className="border p-2 w-full mb-3" />
        <button onClick={handleLogin} className="bg-blue-500 text-white px-5 py-2 rounded w-full">Login</button>
      </div>
    </div>
  );
};

export default AdminLogin;

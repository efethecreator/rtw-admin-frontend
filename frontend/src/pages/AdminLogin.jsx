import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdminLoginStore from "../store/adminLoginStore";
import backgroundImage from "../assets/remotetechAdmin.png";
import loginImage from "../assets/adminpagelock.png";
import { FiUser, FiLock } from "react-icons/fi";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginAdmin, loading, error } = useAdminLoginStore();

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    setFormVisible(true);

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginAdmin(email, password, navigate);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `scale(1.1) translate(${offset.x}px, ${
            offset.y
          }px) rotate(${offset.x / 100}deg)`,
        }}
      ></div>

      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row bg-white p-10 rounded-md shadow-2xl w-[800px]">
        {/* Left Side Image */}
        <div className="flex items-center justify-center p-16 md:w-1/2">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-200 h-auto md:w-200"
          />
        </div>

        {/* Divider Line */}
        <div className="hidden md:block h-90 border-l-2 border-gray-300 mx-8"></div>

        {/* Right Side Login Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-6 flex flex-col justify-center w-full md:w-1/2"
        >
          <h2 className="text-3xl text-gray-800 block text-s font-semibold mb-1">
            iView Admin Panel
          </h2>
          <p className="text-gray-500 ">Login with your admin credentials.</p>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Kullanıcı Adı Input */}
          <div className="relative group flex items-center bg-gray-100 rounded-full px-4 py-3 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <FiUser className="text-indigo-500 text-2xl mr-3" />
            <input
              type="text"
              placeholder="Your e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* Şifre Input */}
          <div className="relative group flex items-center bg-gray-100 rounded-full px-4 py-3 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <FiLock className="text-indigo-500 text-2xl mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* Login Button with Subtle Neon Effect */}
          <button
            type="submit"
            className={`w-full py-3 rounded-full bg-[#32948e] text-white text-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#32948e] focus:ring-opacity-50 shadow-md ${
              loading
                ? "cursor-not-allowed opacity-50"
                : "hover:shadow-[0_0_8px_#32948e,0_0_15px_#32948e]"
            }`}
            disabled={loading}
          >
            <span
              className={`transition-transform duration-300 ${
                loading ? "animate-pulse" : ""
              }`}
            >
              {loading ? "Loading..." : "LOG IN"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

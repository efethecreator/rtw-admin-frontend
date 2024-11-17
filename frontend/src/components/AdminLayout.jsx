import React, { useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import logo from "../assets/iviewlogo.png";
import axios from "axios";
import useQuestionStore from "../store/questionStore";
import { FaSignOutAlt } from 'react-icons/fa'; // React Icons'dan çıkış ikonunu içe aktarıyoruz

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchQuestionPackages } = useQuestionStore();

  useEffect(() => {
    const loadPackages = async () => {
      await fetchQuestionPackages();
    };
    loadPackages();
  }, [fetchQuestionPackages]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/admin/logout', {}, { withCredentials: true });
      navigate("/"); // Login sayfasına yönlendirme
    } catch (error) {
      console.error("Logout işlemi sırasında bir hata oluştu", error);
    }
  };

  return (
    <div className="flex bg-blue min-h-screen">
      <div className="w-65 p-8 shadow-xl flex flex-col items-start bg-gradient-to-t from-[#207c6c] to-white">
        <img src={logo} alt="iView Logo" className="w-40 h-auto mb-6 ml-16 mt-55" />
        <ul className="space-y-6">
          <li><Link to="/admin-dashboard/questions" className="ml-2 block text-lg font-medium text-black py-2 px-4 rounded-lg hover:bg-[#B3D2CD] hover:text-gray-700 hover:shadow-lg transition-all duration-300 relative">Manage Question Package</Link></li>
          <li><Link to="/admin-dashboard/interviews" className="ml-2 block text-lg font-medium text-black py-2 px-4 rounded-lg hover:bg-[#B3D2CD] hover:text-gray-700 hover:shadow-lg transition-all duration-300 relative">Interview List</Link></li>
        </ul>
        <button
          onClick={handleLogout}
          className="mt-auto ml-2 block text-lg font-medium text-black py-2 px-4 rounded-lg hover:bg-[#62A297] hover:text-gray-700 hover:shadow-lg transition-all duration-300 relative"
        >
          <FaSignOutAlt className="inline-block mr-2" /> Log Out
        </button>
      </div>
      <div className="flex-1 px-3 py-8 bg-white items-start bg-gradient-to-t from-[#207c6c] to-white ">
        {location.pathname === "/admin-dashboard" && <h1 className="text-4xl text-gray-800 font-semibold">Hoş Geldin!</h1>}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

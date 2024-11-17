import React, { useEffect, useState } from "react";
import useQuestionStore from "../store/questionStore";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa"; // React icons
import { motion } from "framer-motion"; // For advanced animations

const QuestionManagement = () => {
  const {
    questionPackages = [], // Varsayılan olarak boş bir dizi atıyoruz
    createQuestionPackage,
    deleteQuestionPackage,
    fetchQuestionPackages,
  } = useQuestionStore();

  const [newPackageTitle, setNewPackageTitle] = useState("");

  const addQuestionPackage = async () => {
    if (newPackageTitle.trim() === "") return;
    await createQuestionPackage(newPackageTitle);
    setNewPackageTitle("");
  };

  useEffect(() => {
    fetchQuestionPackages();
  }, [fetchQuestionPackages]);

  return (
    <div className="relative p-8 min-h-[93vh] max-h-[93vh] rounded-3xl shadow-2xl min-w-[90px] max-w-[1250px] overflow-hidden">
      {/* Blur Arka Plan İçin Before Element */}
      <div className="absolute inset-100 z-0 bg-gradient-to-br from-[#207c6c] to-transparent blur-2xl"></div>

      {/* İçerik Alanı */}
      <div className="relative z-10">
        <h2 className="text-3xl text-gray-800 mb-6 font-semibold text-center">
          Manage Question Packages
        </h2>

        {/* New Package Input Area */}
        <div className="flex items-center justify-between p-4 rounded-xl shadow-lg mb-8 bg-gradient-to-br from-white/40 to-transparent backdrop-blur-lg border-transparent/10">
          <div className="flex flex-col w-full mr-4">
            <label
              htmlFor="packageTitle"
              className="text-gray-700 mb-2 font-medium"
            >
              Enter New Package Name
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-3 w-full mr-4 focus:outline-none focus:ring focus:ring-blue-200 transition-all bg-transparent placeholder-gray-500"
              placeholder="Enter new package name..."
              value={newPackageTitle}
              onChange={(e) => setNewPackageTitle(e.target.value)}
            />
          </div>
          <motion.button
            onClick={addQuestionPackage}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center justify-center space-x-2 mt-7"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus />
            <span className="text-sm">Add Package</span>
          </motion.button>
        </div>

        {/* Question Packages Table */}
        <div className="shadow-xl rounded-xl overflow-y-auto max-h-[464px] min-h-[450px] bg-[#DAE9E6]/60 backdrop-blur-lg">
          <table className="min-w-full table-auto text-center">
            <thead>
              <tr className="to-transparent backdrop-blur-md border-[1px] border-l-[0px] border-r-[0px] border-t-[0px] border-gray-600">
                <th className="px-6 py-3 text-gray-600 font-medium">#</th>
                <th className="px-6 py-3 text-gray-600 font-medium">
                  Package Name
                </th>
                <th className="px-6 py-3 text-gray-600 font-medium">
                  Question Count
                </th>
                <th className="px-6 py-3 text-gray-600 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="from-white/10 to-white/10">
              {questionPackages.map((pkg, index) => (
                <tr
                  key={pkg._id}
                  className="border-[1px] border-l-[0px] border-r-[0px] border-t-[0px] border-gray-400 hover:!bg-[#97C1BA] transition-all"
                >
                  <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-700">{pkg.title}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {pkg.questions.length}
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-4">
                    <motion.button
                      onClick={() => deleteQuestionPackage(pkg._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -15, scale: 0.9 }}
                    >
                      <FaTrash className="text-xl" />
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        window.location.href = `/admin-dashboard/questions/manage/${pkg._id}`;
                      }}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -15, scale: 0.9 }}
                    >
                      <FaEdit className="text-xl" />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionManagement;

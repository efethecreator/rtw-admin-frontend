import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useQuestionStore from "../store/questionStore";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ManagePackage = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { questionPackages, updateQuestionPackage } = useQuestionStore();
  const [packageData, setPackageData] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newTime, setNewTime] = useState("");
  const [tempQuestions, setTempQuestions] = useState([]);
  const [deletedQuestions, setDeletedQuestions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const selectedPackage = questionPackages.find(
      (pkg) => pkg._id === packageId
    );
    if (selectedPackage) {
      setPackageData(selectedPackage);
      setNewTitle(selectedPackage.title);
    }
  }, [packageId, questionPackages]);

  const handleSave = async () => {
    if (packageData) {
      const updatedData = {
        questions: [
          ...packageData.questions.filter(
            (question) => !deletedQuestions.includes(question._id)
          ),
          ...tempQuestions,
        ],
        title: newTitle,
      };

      await updateQuestionPackage(packageId, updatedData);
      setTempQuestions([]);
      setDeletedQuestions([]);
      navigate("/admin-dashboard/questions");
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newTime.trim()) {
      const newQ = { question: newQuestion, time: newTime };
      setTempQuestions((prevQuestions) => [...prevQuestions, newQ]);
      setIsPopupOpen(false);
      setNewQuestion("");
      setNewTime("");
    }
  };

  const handleDeleteQuestion = (questionId) => {
    setTempQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.question !== questionId)
    );
    setDeletedQuestions((prevDeleted) => [...prevDeleted, questionId]);
  };

  return (
    <div className="relative p-8 min-h-[93vh] max-h-[93vh] rounded-3xl shadow-2xl min-w-[90px] max-w-[1250px] overflow-hidden">
      <div className="absolute inset-100 z-0 bg-gradient-to-br from-[#207c6c] to-transparent blur-2xl"></div>
      {packageData && (
        <>
          <h2 className="text-3xl text-gray-800 mb-6 font-semibold text-center">
            Manage Question Packages
          </h2>

          {/* Soru Başlığı Düzenleme Kısmı */}
          <div className="flex items-center justify-between p-4 rounded-xl shadow-lg mb-8 bg-gradient-to-br from-white/40 to-transparent backdrop-blur-lg border-transparent/10">
            <div className="flex flex-col w-full mr-4">
              <label
                htmlFor="packageTitle"
                className="text-gray-700 mb-2 font-medium"
              >
                Edit Package Title
              </label>
              <input
                id="packageTitle"
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full mr-4 focus:outline-none focus:ring focus:ring-blue-200 transition-all bg-transparent placeholder-gray-500"
                placeholder="Package Title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <motion.button
              onClick={() => setIsPopupOpen(true)}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center justify-center space-x-2 mt-7"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
              <span className="text-sm">Add Question</span>
            </motion.button>
          </div>

          {/* Soru Listesi Tablosu */}
          <div className="shadow-xl rounded-xl overflow-y-auto max-h-[420px] min-h-[410px] bg-[#DAE9E6]/60 backdrop-blur-lg">
            <table className="min-w-full table-auto text-center overflox-x-auto">
              {/* Tüm tabloyu ortalamak için text-center ekledik */}
              <thead>
                <tr className="to-transparent backdrop-blur-md border-[1px] border-l-[0px] border-r-[0px] border-t-[0px] border-gray-600">
                  <th className="px-6 py-3 text-gray-600 font-medium">#</th>
                  <th className="px-6 py-3 text-gray-600 font-medium">
                    Question
                  </th>
                  <th className="px-6 py-3 text-gray-600 font-medium">Time</th>
                  <th className="px-6 py-3 text-gray-600 font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="border-[1px] border-l-[0px] border-r-[0px] border-t-[0px] border-gray-400 ">
                {packageData.questions
                  .filter(
                    (question) => !deletedQuestions.includes(question._id)
                  )
                  .map((question, index) => (
                    <tr
                      key={question._id}
                      className="border-[1px] border-l-[0px] border-r-[0px] border-t-[0px] border-gray-400 hover:!bg-[#97C1BA] transition-all"
                    >
                      <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {question.question}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {question.time}
                      </td>
                      <td className="px-6 py-4 flex justify-center space-x-4">
                        <motion.button
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="text-red-500 hover:text-red-700"
                          whileHover={{ rotate: 15, scale: 1.2 }}
                          whileTap={{ rotate: -15, scale: 0.9 }}
                        >
                          <FaTrash className="text-xl" />
                        </motion.button>
                      </td>
                    </tr>
                  ))}

                {tempQuestions.map((question, index) => (
                  <tr
                    key={`temp-${index}`}
                    className="border-t hover:bg-gray-50 transition-all"
                  >
                    <td className="px-6 py-4 text-gray-700">
                      {packageData.questions.length + index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {question.question}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{question.time}</td>
                    <td className="px-6 py-4 flex justify-center space-x-4">
                      <motion.button
                        onClick={() => handleDeleteQuestion(question.question)}
                        className="text-red-500 hover:text-red-700"
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        whileTap={{ rotate: -15, scale: 0.9 }}
                      >
                        <FaTrash className="text-xl" />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kaydet ve İptal Butonları */}
          <div className="flex justify-end mt-4 space-x-2">
            <motion.button
              onClick={() => navigate("/admin-dashboard/questions")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSave}
              className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save
            </motion.button>
          </div>

          {/* Add Question Modal */}
          <AnimatePresence>
            {isPopupOpen && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Add a New Question
                  </h3>

                  <textarea
                    placeholder="Enter question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full h-24"
                  />
                  <input
                    type="number" // Sadece sayı girişine izin verir.
                    placeholder="Enter time..."
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                    min="1" // Negatif sayılar önlenir.
                    step="1" // Sadece tam sayı girişi yapılabilir.
                  />
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      onClick={() => setIsPopupOpen(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleAddQuestion}
                      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default ManagePackage;

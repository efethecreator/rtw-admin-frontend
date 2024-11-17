// Interview frontend component linked with interview store
import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaInfoCircle, FaCopy, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useInterviewStore from "../store/useInterviewStore";
import useVideoStore from "../store/useVideoCollectionStore";
import axios from "axios";

const InterviewInfoPopup = ({ interviewId, onClose }) => {
  const { interviewQuestions, fetchInterviewQuestions } = useInterviewStore();

  useEffect(() => {
    if (interviewId) {
      fetchInterviewQuestions(interviewId);
    }
  }, [interviewId, fetchInterviewQuestions]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg relative max-h-[80vh] sm:max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-teal-700 mb-4">
          Package Questions
        </h2>
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <ul className="space-y-4">
          {interviewQuestions.map((q, index) => (
            <li
              key={q._id || index}
              className="bg-gray-100 p-4 rounded-lg shadow"
            >
              <p className="font-semibold">
                {index + 1}: {q.question}
              </p>
              <p className="text-sm text-gray-600">{q.time} min</p>
              <p className="text-xs text-gray-500">
                {q.packageTitle
                  ? `Package: ${q.packageTitle}`
                  : "Extra Question"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Soru Ekleme Popup'ı
const AddQuestionPopup = ({ onClose, onSubmit }) => {
  const [questionText, setQuestionText] = useState("");
  const [timeLimit, setTimeLimit] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ questionText, timeLimit });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="min-h-[200px] min-w-[300px] bg-white p-4 rounded shadow-md">
        <h2 className="text-black font-bold mb-4">Soru Ekle</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-black block text-sm font-semibold mb-1">
              Soru:
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded p-2 w-full"
              placeholder="Soru metni..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-black block text-sm font-semibold mb-1">
              Zaman Limiti (dk):
            </label>
            <input
              type="number"
              className="border border-gray-200 rounded p-2 w-full"
              placeholder="Dakika"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white rounded p-2"
            >
              İptal
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded p-2"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Popup for creating a new interview
const Popup = ({ onClose, onSubmit, questionPackages }) => {
  const [interviewTitle, setInterviewTitle] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [extraQuestions, setExtraQuestions] = useState([]);
  const [isAddQuestionPopupOpen, setIsAddQuestionPopupOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newTimeLimit, setNewTimeLimit] = useState("");
  const [error, setError] = useState("");

  const handleAddQuestion = () => {
    if (!newQuestionText.trim() || !newTimeLimit.trim()) {
      setError("Both question text and time limit are required.");
    } else {
      setExtraQuestions([
        ...extraQuestions,
        { questionText: newQuestionText, timeLimit: newTimeLimit },
      ]);
      setNewQuestionText("");
      setNewTimeLimit("");
      setError("");
      setIsAddQuestionPopupOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const interviewData = {
      title: interviewTitle,
      expireDate: new Date(expireDate).toISOString(),
      packages: selectedPackages.map((pkg) => ({
        packageId: pkg._id,
      })),
      questions: extraQuestions.map((q) => ({
        question: q.questionText,
        time: q.timeLimit,
      })),
    };

    onSubmit(interviewData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="min-h-[320px] min-w-[500px] bg-white p-4 rounded shadow-md"
      >
        <h2 className="text-black font-bold mb-4">Create Interview</h2>
        <form onSubmit={handleSubmit}>
          {/* Interview Title */}
          <div className="mb-4">
            <label className="text-black block text-sm font-semibold mb-1">
              Interview Title:
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded p-2 w-full"
              placeholder="Enter interview title..."
              value={interviewTitle}
              onChange={(e) => setInterviewTitle(e.target.value)}
              required
            />
          </div>
          {/* Expire Date */}
          <div className="mb-4">
            <label className="text-black block text-sm font-semibold mb-1">
              Expire Date:
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded p-2 w-full"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              required
            />
          </div>
          {/* Package Selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Package</label>
            <select
              className="border p-2 rounded-md w-full block text-black-200 font-semibold mb-1"
              onChange={(e) => {
                const selectedPackageId = e.target.value;
                const selectedPackage = questionPackages.find(
                  (pkg) => pkg._id === selectedPackageId
                );
                if (
                  selectedPackage &&
                  !selectedPackages.some((pkg) => pkg._id === selectedPackageId)
                ) {
                  setSelectedPackages([...selectedPackages, selectedPackage]);
                }
              }}
              value=""
            >
              <option value="" disabled>
                Select Package
              </option>
              {questionPackages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.title}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap mt-2">
              {selectedPackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-gray-200 rounded-full px-3 py-1 m-1 flex items-center"
                >
                  <span>{pkg.title}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() =>
                      setSelectedPackages(
                        selectedPackages.filter((p) => p._id !== pkg._id)
                      )
                    }
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Extra Questions */}
          <div className="mb-4">
            <label className="text-black block text-sm font-semibold mb-1">
              Extra Questions
            </label>
            <motion.button
              type="button"
              className="flex items-center text-blue-500 text-sm"
              onClick={() => setIsAddQuestionPopupOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaPlus className="mr-1" />
              Add Question
            </motion.button>

            <div className="mt-2">
              {extraQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-200 p-2 rounded mt-1 flex justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <span>{`${question.questionText} (Time Limit: ${question.timeLimit} mins)`}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Submission Buttons */}
          <div className="flex justify-end space-x-2">
            <motion.button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Add Question Popup */}
      <AnimatePresence>
        {isAddQuestionPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center z-50"
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
              <h3 className="text-xl font-semibold mb-4">Add a New Question</h3>
              <textarea
                placeholder="Enter question..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full h-24"
              />
              <input
                type="number"
                placeholder="Enter time (mins)"
                value={newTimeLimit}
                onChange={(e) => setNewTimeLimit(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                min="1"
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end space-x-2">
                <motion.button
                  onClick={() => {
                    setIsAddQuestionPopupOpen(false);
                    setError("");
                  }}
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
    </div>
  );
};

const JobPositionForm = () => {
  const { interviews, fetchInterviews, createInterview, deleteInterview } =
    useInterviewStore();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [questionPackages, setQuestionPackages] = useState([]);
  const [showInfo, setShowInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { fetchVideos } = useVideoStore();
  const interviewsPerPage = 15;
  

  // Soru paketlerini yükleme ve mülakatları güncelleme
  useEffect(() => {
    const loadQuestionPackages = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/packages", {
          withCredentials: true,
        });
        const data = response.data;
        setQuestionPackages(data);
      } catch (error) {
        console.error("Soru paketleri yüklenirken hata oluştu:", error);
      }
    };
    loadQuestionPackages();
    fetchInterviews();
  }, [fetchInterviews]);

  // isPublished durumunu güncelleyen fonksiyon
  const processedInterviews = interviews.map((interview) => ({
    ...interview,
    isPublished: new Date(interview.expireDate) > new Date(),
  }));

  const handleAddJobPosition = () => setIsPopupOpen(true);
  const handlePopupClose = () => setIsPopupOpen(false);
  const handleSubmit = async (data) => {
    await createInterview(data);
    setIsPopupOpen(false);
    fetchInterviews(); // Yeni mülakat eklendikten sonra listeyi yenileyin
  };

  // Linki sadece isPublished durumunda kopyalama
  const handleCopyLink = (interview) => {
    if (!interview.isPublished) {
      alert("Bu mülakat süresi dolmuş. Link kopyalanamaz.");
      return;
    }
    const link = `http://localhost:5000/${interview._id}`;
    navigator.clipboard.writeText(link);
    alert("Link kopyalandı!");
  };

  useEffect(() => {
    if (interviews.length > 0) {
      interviews.forEach((interview) => fetchVideos(interview._id));
    }
  }, [interviews, fetchVideos]);

  const handleDelete = async (id) => {
    await deleteInterview(id);
    fetchInterviews(); // Mülakat silindikten sonra listeyi yenileyin
  };

  const indexOfLastInterview = currentPage * interviewsPerPage;
  const indexOfFirstInterview = indexOfLastInterview - interviewsPerPage;
  const currentInterviews = processedInterviews.slice(
    indexOfFirstInterview,
    indexOfLastInterview
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="relative p-8 min-h-[93vh] max-h-[93vh] rounded-3xl shadow-2xl min-w-[90px] max-w-[1250px] overflow-hidden">
      <div className="flex items-center justify-center mb-6 mt-0">
        <h2 className="text-3xl text-gray-800 font-semibold mr-6">
          Interview List
        </h2>
        <motion.button
          onClick={handleAddJobPosition}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center justify-center space-x-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="text-2xl mr-2" />
          <span className="text-lg font-medium">Create Interview</span>
        </motion.button>
      </div>

      {isPopupOpen && (
        <Popup
          onClose={handlePopupClose}
          onSubmit={handleSubmit}
          questionPackages={questionPackages}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {currentInterviews.map((interview) => (
          <div
            key={interview._id}
            className="bg-gradient-to-br from-[#B1D1CB] to-transparent backdrop-blur-2xl rounded-xl p-4 shadow-xl relative"
          >
            <div className="absolute top-2 left-2">
              <motion.button
                onClick={() => setShowInfo(interview._id)}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                whileHover={{ scale: 1.2 }}
              >
                <FaInfoCircle className="text-xl" />
              </motion.button>
            </div>
            <div className="absolute top-2 right-2 flex space-x-2">
              <motion.button
                onClick={() => handleCopyLink(interview)}
                className={`text-green-500 hover:text-green-700 transition-colors ${
                  !interview.isPublished && "cursor-not-allowed"
                }`}
                disabled={!interview.isPublished}
                whileHover={{ scale: 1.2, rotate: -15 }}
              >
                <FaCopy className="text-xl" />
              </motion.button>
              <motion.button
                onClick={() => handleDelete(interview._id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                whileHover={{ rotate: 15, scale: 1.2 }}
                whileTap={{ rotate: -15, scale: 0.9 }}
              >
                <FaTrash className="text-xl" />
              </motion.button>
            </div>
            <div className="relative max-w-[300px] group">
  {/* Kartın ana bölümü */}
  <div
    className="text-black font-semibold mb-2 mt-5 text-2xl truncate overflow-hidden"
    title={interview.title} // Bu özellik, yazıyı tarayıcıda da gösterir.
  >
    {interview.title}
  </div>

  {/* Tooltip */}
  <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm p-2 rounded-lg shadow-lg top-full mt-2 left-1/2 transform -translate-x-1/2 z-10">
    {interview.title}
  </div>
</div>
            <p className="text-sm mb-2">Candidates:</p>
            <div className="bg-gray-300 rounded-lg p-2 flex justify-around mb-4">
              <div className="text-center border-l border-gray-400">
                <p className="text-xs text-gray-600 ml-2">TOTAL</p>
                <p className="text-xl font-semibold">{interview.totalVideos}</p>
              </div>
              <div className="text-center border-l border-gray-400">
                <p className="text-xs text-gray-600 ml-2">ON HOLD</p>
                <p className="text-xl font-semibold">
                  {interview.pendingVideos}
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-4 items-center text-sm">
              <span
                className={`${
                  interview.isPublished ? "text-green-700" : "text-red-700"
                }`}
              >
                {interview.isPublished ? "Published" : "Unpublished"}
              </span>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() =>
                  (window.location.href = `/admin-dashboard/video-collection/${interview._id}`)
                }
              >
                See Videos &gt;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-5 from-gray-100 to-gray-200 rounded-3xl">
        {Array.from(
          { length: Math.ceil(interviews.length / interviewsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 border rounded-full ${
                i + 1 === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      {showInfo && (
        <InterviewInfoPopup
          interviewId={showInfo}
          onClose={() => setShowInfo(null)}
        />
      )}
    </div>
  );
};

export default JobPositionForm;

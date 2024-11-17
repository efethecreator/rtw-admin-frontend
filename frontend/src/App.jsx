import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import QuestionManagement from "./components/QuestionManagement";
import ManagePackage from "./components/ManagePackage";
import CandidateInterviews from "./pages/CandidateInterviews";
import VideoCollectionPage from "./pages/VideoCollectionPage";
import NotFound from "./pages/NotFound"; // 404 sayfası eklendi
import useQuestionStore from "./store/questionStore";

const App = () => {
  const { fetchQuestionPackages } = useQuestionStore();
  const [questionPackages, setQuestionPackages] = useState([]);

  useEffect(() => {
    // Bu useEffect'i App.jsx'ten kaldırdık
  }, [fetchQuestionPackages]);

  return (
    <Router>
      <Routes>
        {/* Ana giriş sayfası */}
        <Route path="/" element={<AdminLogin />} />

        {/* Admin paneli */}
        <Route path="/admin-dashboard" element={<AdminLayout onInit={fetchPackages} />}>
          {/* Soru yönetimi */}
          <Route
            path="questions"
            element={<QuestionManagement setQuestionPackages={setQuestionPackages} />}
          />

          {/* Paket düzenleme sayfası */}
          <Route
            path="questions/manage/:packageId"
            element={<ManagePackage questionPackages={questionPackages} />}
          />

          {/* Aday mülakat listesi */}
          <Route path="interviews" element={<CandidateInterviews />} />

          {/* Video koleksiyon sayfası */}
          <Route
            path="video-collection/:interviewId"
            element={<VideoCollectionPage />}
          />
        </Route>

        {/* 404 Sayfası */}
        <Route path="/404" element={<NotFound />} />
        {/* Geçersiz rotalar için 404 yönlendirme */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );

  // Fetch paketleri yükleyen ve state'i güncelleyen fonksiyon
  function fetchPackages() {
    const loadPackages = async () => {
      const packages = await fetchQuestionPackages();
      setQuestionPackages(packages);
    };
    loadPackages();
  }
};

export default App;

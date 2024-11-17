// VideoDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useVideoCollectionStore from "../store/useVideoCollectionStore";

const VideoDetailPage = () => {
  const { id } = useParams(); // video ID'sini URL'den alıyoruz
  const [userInfo, setUserInfo] = useState(null);
  const [questionPackage, setQuestionPackage] = useState(null);

  const { video, fetchVideoById } = useVideoCollectionStore((state) => ({
    video: state.videoUrl,
    fetchVideoById: state.fetchVideoById,
  }));

  useEffect(() => {
    // Videoyu ve kullanıcı bilgilerini getir
    const fetchVideoData = async () => {
      try {
        // Video bilgilerini store'dan al
        await fetchVideoById(id);

        if (video) {
          // Kullanıcı bilgilerini al
          const userResponse = await axios.get(
            `http://localhost:8000/api/users/${video.userId}`
          );
          setUserInfo(userResponse.data);

          // Soru paketini al
          const questionPackageResponse = await axios.get(
            `http://localhost:8000/api/question-packages/${video.questionPackageId}`
          );
          setQuestionPackage(questionPackageResponse.data);
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoData();
  }, [id, video, fetchVideoById]);

  if (!video || !userInfo || !questionPackage) return <p>Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row items-start p-6">
      {/* Sol panel: Video oynatma */}
      <div className="w-full md:w-2/3 mb-6 md:mb-0">
        <video
          src={video}
          controls
          className="w-full h-auto rounded shadow-lg"
        />
      </div>

      {/* Sağ panel: Kullanıcı bilgileri ve soru paketi */}
      <div className="w-full md:w-1/3 md:pl-6 flex flex-col space-y-4">
        {/* Kullanıcı Bilgileri */}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Kullanıcı Bilgileri</h2>
          <p>
            <strong>İsim:</strong> {userInfo.name} {userInfo.surname}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p>
            <strong>Telefon:</strong> {userInfo.phone}
          </p>
          <p>
            <strong>Not:</strong> {userInfo.note}
          </p>
        </div>

        {/* Soru Paketi ve Sorular */}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Soru Paketi</h2>
          <p>
            <strong>Paket Adı:</strong> {questionPackage.name}
          </p>
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-1">Sorular:</h3>
            <ul className="list-disc list-inside space-y-1">
              {questionPackage.questions.map((question, index) => (
                <li key={index}>
                  {index + 1}. {question.text} ({question.time} dakika)
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;
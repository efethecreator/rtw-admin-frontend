import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useVideoStore from "../store/useVideoCollectionStore";
import axios from "axios";
import myImage from '../assets/intw1.png';

const VideoCollection = () => {
  const { videos, fetchVideos } = useVideoStore();
  const { interviewId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [statusData, setStatusData] = useState({});

  const [pass, setPass] = useState(false);
  const [fail, setFail] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (interviewId) fetchVideos(interviewId);
  }, [interviewId, fetchVideos]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    setPass(video.pass); // Pass durumunu her modal açıldığında güncelle
    setFail(video.fail); // Fail durumunu her modal açıldığında güncelle
    setNote(video.note); // Notu her modal açıldığında güncelle
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setNote("");
  };

  // Güncel durum ve notu backend'e gönder ve frontend'de güncelle
  const updateStatusInBackend = async (videoId, userId, pass, fail, note) => {
    console.log({ videoId, userId, pass, fail, note });
    console.log(videos);
    try {
      const response = await axios.put(`http://localhost:8000/api/videos`, {
        interviewId,
        videoId,
        userId,
        pass,
        fail,
        note,
      });

      // Backend güncellenirken state'i de güncelle
      setStatusData((state) => ({
        ...state,
        [videoId]: response.data,
      }));

      // Anında değişikliği görmek için videos listesini güncelle
      const updatedVideos = videos.map((video) =>
        video._id === videoId ? { ...video, pass, fail, note } : video
      );
      useVideoStore.setState({ videos: updatedVideos });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleStatusChange = (videoId, pass, fail) => {
    console.log({ videoId, pass, fail });
    updateStatusInBackend(videoId, selectedVideo.user?._id, pass, fail, note);
  };

  const handleSaveAndClose = () => {
    if (selectedVideo) {
      handleStatusChange(selectedVideo._id, pass, fail);
      closeModal();
    }
  };

  return (
    <div className="relative p-8 min-h-[93vh] max-h-[93vh] rounded-3xl shadow-2xl min-w-[90px] max-w-[1250px] overflow-hidden">
      {videos.length === 0 ? (
        <p className="text-center text-gray-500">No videos found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-gradient-to-br from-[#B1D1CB] to-transparent backdrop-blur-2xl rounded-xl p-4 shadow-xl relative flex flex-col justify-between"
            >
              <div>
              <img
              src={myImage}
                className="w-full h-48 rounded-md mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {video.user?.name} {video.user?.surname}
                </h3>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p
                  className={`font-semibold ${
                    video.pass
                      ? "text-green-500"
                      : video.fail
                      ? "text-red-500"
                      : "text-orange-500"
                  }`}
                >
                  {video.pass ? "Pass" : video.fail ? "Fail" : "Pending"}
                </p>
                <button
                  onClick={() => handleVideoClick(video)}
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Component */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedVideo.user?.name} {selectedVideo.user?.surname} -
              Interview
            </h2>
            <video
              src={selectedVideo.s3Url}
              controls
              className="w-full h-64 rounded-md mb-4"
            ></video>

            <div className="mb-4">
              <p className="underline text-lg font-bold">
                <strong>Personal Information</strong>
              </p>
              <p>
                <strong>Name:</strong> {selectedVideo.user?.name}
              </p>
              <p>
                <strong>Surname:</strong> {selectedVideo.user?.surname}
              </p>
              <p>
                <strong>Email:</strong> {selectedVideo.user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedVideo.user?.phone}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold">Status</label>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setFail(false);
                    setPass(true);
                  }}
                  className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 rounded-lg shadow-md transition-all"
                >
                  Pass
                </button>
                <button
                  onClick={() => {
                    setFail(true);
                    setPass(false);
                  }}
                  className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 rounded-lg shadow-md transition-all"
                >
                  Fail
                </button>
                <button
                  onClick={() => {
                    setFail(false);
                    setPass(false);
                  }}
                  className="px-6 py-2 text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-300 rounded-lg shadow-md transition-all"
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Note Section */}
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2 text-gray-700">Note</label>
              <textarea
                value={note}
                val={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 shadow-sm"
                rows="4"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveAndClose}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold shadow-md hover:from-teal-600 hover:to-teal-800 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-200"
              >
                Save and Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCollection;

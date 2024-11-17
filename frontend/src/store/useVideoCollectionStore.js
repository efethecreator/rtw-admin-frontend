import { create } from "zustand";
import axios from "axios";

const useVideoStore = create((set) => ({
  videos: [],
  questions: [],
  statusData: {},

  // Videoları interviewId'ye göre getir
  fetchVideos: async (interviewId) => {
    try {
      const response = await axios.get(`/api/videos/${interviewId}`, {
        withCredentials: true,
      });
      console.log(response.data);
      const videoData = await Promise.all(
        response.data.map(async (video) => {
          const userResponse = await axios.get(`/api/users/${video.userId}`, {
            withCredentials: true,
          });
          return { ...video, user: userResponse.data };
        })
      );

      set({ videos: videoData });
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  },

  // Soruları interviewId'ye göre getir
  fetchQuestions: async (interviewId) => {
    try {
      const response = await axios.get(
        `/api/interviews/${interviewId}/questions`
      );
      set({ questions: response.data.questions });
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  },

  // Video yükle
  uploadVideo: async (file, userId, interviewId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("interviewId", interviewId);

    try {
      const response = await axios.post("/api/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        videos: [...state.videos, response.data],
      }));
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  },

  // Video sil
  deleteVideo: async (videoId, interviewId) => {
    try {
      await axios.delete(`/api/videos/${videoId}`, {
        data: { interviewId },
      });

      set((state) => ({
        videos: state.videos.filter((video) => video._id !== videoId),
      }));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  },
}));

export default useVideoStore;

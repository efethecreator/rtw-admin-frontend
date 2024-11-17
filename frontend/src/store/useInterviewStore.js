// src/store/interviewStore.js
import { create } from "zustand";
import axios from "axios";

// Zustand store
const useInterviewStore = create((set) => ({
  interviews: [],
  interview: null,
  interviewQuestions: [], // Yeni state: mülakat soruları
  loading: false,
  error: null,

  // Tüm mülakatları getirme
  fetchInterviews: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/interview/", {
        withCredentials: true,
      });
      set({ interviews: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch interviews", loading: false });
    }
  },

  // Yeni mülakat oluşturma
  createInterview: async (interviewData) => {
    console.log("interviewData: ", interviewData);
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        "/api/interview/create",
        interviewData,
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set((state) => ({
        interviews: [...state.interviews, response.data.interview],
        loading: false,
      }));
    } catch (error) {
      console.error(error);
      set({ error: "Failed to create interview", loading: false });
    }
  },

  // Belirli bir mülakatı ID ile getirme
  fetchInterviewById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `/api/interview/${id}
      }`,
        {
          withCredentials: true,
        }
      );
      set({ interview: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch interview", loading: false });
    }
  },

  // Yeni fonksiyon: Mülakat sorularını getirme
  fetchInterviewQuestions: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/interview/${id}/questions`, {
        withCredentials: true,
      });
      set({ interviewQuestions: response.data.questions, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch interview questions", loading: false });
    }
  },

  // Mülakatı ID ile silme
  deleteInterview: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/api/interview/delete/${id}`, {
        withCredentials: true,
      });
      set((state) => ({
        interviews: state.interviews.filter(
          (interview) => interview._id !== id
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useInterviewStore;

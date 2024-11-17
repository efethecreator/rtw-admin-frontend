import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const useQuestionStore = create((set) => ({
  questionPackages: [],
  loading: false,
  error: null,

  // Fetch all question packages
  fetchQuestionPackages: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("http://localhost:8000/api/packages", {
        withCredentials: true,
      });
      set({ questionPackages: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Create a new question package
  createQuestionPackage: async (title) => {
    set({ loading: true });
    console.log("title");
    try {
      const response = await axios.post("http://localhost:8000/api/packages", {
        title,
      });
      console.log("deneme");
      set((state) => ({
        questionPackages: [...state.questionPackages, response.data],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Add a question to a question package
  addQuestionToPackage: async (packageId, question, time) => {
    console.log("1");
    set({ loading: true });
    try {
      console.log("1");
      const response = await axios.post(
        `http://localhost:8000/api/packages/${packageId}/questions`,
        {
          question,
          time,
        }
      );
      console.log("2");
      set((state) => ({
        questionPackages: state.questionPackages.map((pkg) =>
          pkg._id === packageId ? response.data : pkg
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Update a question package
  updateQuestionPackage: async (packageId, updatedData) => {
    set({ loading: true });
    console.log("updatedData", updatedData);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/packages/${packageId}`,
        updatedData
      );
      set((state) => ({
        questionPackages: state.questionPackages.map((pkg) =>
          pkg._id === packageId ? response.data : pkg
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Delete a question package
  deleteQuestionPackage: async (packageId) => {
    set({ loading: true });
    try {
      await axios.delete(`http://localhost:8000/api/packages/${packageId}`);
      set((state) => ({
        questionPackages: state.questionPackages.filter(
          (pkg) => pkg._id !== packageId
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Delete a question from a package
  deleteQuestionFromPackage: async (packageId, questionId) => {
    set({ loading: true });
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/packages/${packageId}/questions/${questionId}`
      );
      set((state) => ({
        questionPackages: state.questionPackages.map((pkg) =>
          pkg._id === packageId ? response.data : pkg
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
}));

export default useQuestionStore;

// stores/useUserStore.js
import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const useUserStore = create((set) => ({
  personalInfo: {
    name: "",
    surname: "",
    email: "",
    phone: "",
  },
  loading: false,
  error: null,

  // Set personal information in state
  setPersonalInfo: (info) => {
    set({ personalInfo: { ...info } });
  },

  // Submit personal information to the backend
  submitPersonalInfo: async () => {
    set({ loading: true });
    try {
      const response = await axios.post("/api/users/create", {
        name: personalInfo.name,
        surname: personalInfo.surname,
        email: personalInfo.email,
        phone: personalInfo.phone,
      });
      console.log("User created:", response.data);
      set({ loading: false });
    } catch (error) {
      console.error("Error submitting personal information:", error);
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
}));

export default useUserStore;

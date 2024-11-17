import { create } from 'zustand';
import axios from 'axios';


const useAdminLoginStore = create((set) => ({
  loading: false,
  error: null,

  // Admin Login işlemi
  loginAdmin: async (email, password, navigate) => {
    set({ loading: true });
    try {
      const response = await axios.post('http://localhost:8000/api/admin/login', {
        email,
        password,
      }, {
        withCredentials: true, // Cookieleri iletmek için gerekli
      });
      
      // Eğer başarılı giriş olursa, admin dashboard'a yönlendirme yap
      if (response.status === 200) {
        navigate('/admin-dashboard');
      }
      
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Giriş başarısız!',
        loading: false,
      });
    }
  },
}));

export default useAdminLoginStore;
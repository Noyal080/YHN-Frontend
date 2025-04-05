import { logout } from "@/redux/authSlice";
import { RootState, store } from "@/redux/store";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL, // Use the API URL from the .env file
  timeout: 30000, // Request timeout in ms
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Add a request interceptor to dynamically add the token to the headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from the cookie

    const state = store.getState() as RootState;
    const { token } = state.auth;
    // If the token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Clear localStorage
        localStorage.clear();
        
        // Dispatch action to clear auth state in Redux
        store.dispatch(logout());
        
        // Redirect to login page
        // Option 1: If using React Router v6+
        window.location.href = '/login';
        
        // Option 2: If not using React Router
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
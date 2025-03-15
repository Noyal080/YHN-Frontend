import { RootState, store } from "@/redux/store";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ;

export const axiosInstance = axios.create({
  baseURL: API_URL, // Use the API URL from the .env file
  timeout: 10000, // Request timeout in ms
  headers: {
    'Content-Type': 'application/json',
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

  

  
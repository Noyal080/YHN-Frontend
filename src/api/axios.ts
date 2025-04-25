import { logout } from "@/redux/authSlice";
import { RootState, store } from "@/redux/store";
import axios from "axios";
import { showErrorToast } from "./errorToast";

const API_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL, // Use the API URL from the .env file
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
        localStorage.clear();
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Handle other error responses
      let errorMessage = "An unexpected error occurred";

      if (error.response) {
        const responseData = error.response.data;

        if (responseData.message) {
          errorMessage = responseData.message;
          console.log("herer2");
        }
        // Case 1: Field-specific errors (like services_id)
        else if (responseData.error && typeof responseData.error === "object") {
          // Join all error messages from different fields
          errorMessage = Object.values(responseData.error)
            .flatMap((errors) => (Array.isArray(errors) ? errors : [errors]))
            .join("\n");
          console.log("herer1");
        }
        // Case 2: Simple message

        // Case 3: Fallback to status text or generic message
        else {
          errorMessage = error.response.statusText || errorMessage;
          console.log("herer3");
        }
      }

      showErrorToast(errorMessage);
    }

    return Promise.reject(error);
  }
);

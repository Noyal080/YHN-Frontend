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
    timeout: 20000,
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

      let errorMessage = "";

      if (error.response) {
        const responseData = error.response.data;

        const messages: string[] = [];

        if (responseData.message) {
          messages.push(responseData.message);
        }

        if (
          responseData.error &&
          typeof responseData.error === "object" &&
          Object.keys(responseData.error).length > 0
        ) {
          const fieldErrors = Object.values(responseData.error).flatMap((val) =>
            Array.isArray(val) ? val : [val]
          );
          messages.push(...fieldErrors);
        }

        if (messages.length === 0) {
          errorMessage =
            error.response.statusText || "An unexpected error occurred";
        } else {
          errorMessage = messages.join("\n");
        }
      } else {
        errorMessage = "An unexpected error occurred";
      }

      showErrorToast(errorMessage);
    }

    return Promise.reject(error);
  }
);

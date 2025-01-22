import axios, {   AxiosResponse } from "axios";

export const axiosInstance = axios.create({
    baseURL:  'http://localhost:5000/api', // Adjust to your environment
    timeout: 10000, // Request timeout in ms
    headers: {
      'Content-Type': 'application/json',
    },
  });

  
  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // You can modify response globally if needed
      return response;
    },
    (error) => {
      if (error.response) {
        // Handle HTTP errors globally
        if (error.response.status === 401) {
          console.error('Unauthorized access, redirecting to login...');
          localStorage.removeItem('token'); // Optionally clear token
          window.location.href = '/login'; // Redirect to login
        }
      } else if (error.request) {
        // Handle network errors
        console.error('Network error, please check your connection.');
      }
      return Promise.reject(error); // Pass errors to calling functions
    }
  );
  
  
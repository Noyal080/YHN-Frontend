import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:  'https://yourshumanlynepal.org.np/api', // Adjust to your environment
    timeout: 10000, // Request timeout in ms
    headers: {
      'Content-Type': 'application/json',
    },
  });

  

  
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:  'https://yourshumanlynepal.anoopinnovations.com/api/', // Adjust to your environment
    timeout: 10000, // Request timeout in ms
    headers: {
      'Content-Type': 'application/json',
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  

  
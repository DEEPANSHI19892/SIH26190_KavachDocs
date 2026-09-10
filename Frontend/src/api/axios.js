import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kavachdocs_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("kavachdocs_token");
      localStorage.removeItem("kavachdocs_user");

      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.error("Access denied");
    }

    return Promise.reject(error);
  }
);

export default api;
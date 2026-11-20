import axios from "axios";
import { API_URL } from "./config";

const api = axios.create({ baseURL: `${API_URL}/api` });

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn API errors into a readable message
export const getErrorMessage = (error) =>
  error.response?.data?.message || "Cannot reach the server. Is the backend running?";

export default api;

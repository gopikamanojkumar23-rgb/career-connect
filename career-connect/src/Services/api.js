import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback ||
    "Something went wrong. Please try again."
  );
}

export default api;

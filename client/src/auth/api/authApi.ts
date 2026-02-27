import axios from "axios";

export const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  withCredentials: true,
});

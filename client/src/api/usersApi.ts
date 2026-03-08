import axios from "axios";
import { authApi } from "../auth/api/authApi";
import { AxiosError, type AxiosRequestConfig } from "axios";

export const usersApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/users`,
  withCredentials: true,
});

usersApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const isAccessTokenExpired =
      error.response && error.response.status === 401;

    if (!isAccessTokenExpired) {
      return Promise.reject(error);
    }

    try {
      await authApi.post("/refresh");
      return usersApi(error.config as AxiosRequestConfig);
    } catch {
      return Promise.reject(error);
    }
  },
);

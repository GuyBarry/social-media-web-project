import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { authApi } from "./authApi";

export const selfAuthApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  withCredentials: true,
});

selfAuthApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const isAccessTokenExpired =
      error.response && error.response.status === 401;

    if (!isAccessTokenExpired) {
      return Promise.reject(error);
    }

    try {
      await authApi.post("/refresh");

      return selfAuthApi(error.config as AxiosRequestConfig);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

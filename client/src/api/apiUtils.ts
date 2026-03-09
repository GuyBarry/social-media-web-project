import { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import { StatusCodes } from "http-status-codes";
import { authApi } from "../auth/api/authApi";

export const attachRefreshInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const isAccessTokenExpired =
        error.response && error.response.status === StatusCodes.UNAUTHORIZED;

      if (!isAccessTokenExpired) {
        return Promise.reject(error);
      }

      try {
        await authApi.post("/refresh");
        return instance(error.config as AxiosRequestConfig);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    },
  );
};

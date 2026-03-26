import axios from "axios";
import { attachRefreshInterceptor } from "./api.utils";

export const commentsApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL || window.location.origin}/comments`,
  withCredentials: true,
});

attachRefreshInterceptor(commentsApi);

import axios from "axios";
import { attachRefreshInterceptor } from "./apiUtils";

export const commentsApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/comments`,
  withCredentials: true,
});

attachRefreshInterceptor(commentsApi);

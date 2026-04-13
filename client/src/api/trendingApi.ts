import axios from "axios";
import { attachRefreshInterceptor } from "./api.utils";

export const trendingApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL || window.location.origin}/trending`,
  withCredentials: true,
});

attachRefreshInterceptor(trendingApi);

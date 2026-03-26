import axios from "axios";
import { attachRefreshInterceptor } from "./api.utils";

export const postsApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL || window.location.origin}/posts`,
  withCredentials: true,
});

attachRefreshInterceptor(postsApi);

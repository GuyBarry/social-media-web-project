import axios from "axios";
import { attachRefreshInterceptor } from "./apiUtils";

export const postsApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/posts`,
  withCredentials: true,
});

attachRefreshInterceptor(postsApi);

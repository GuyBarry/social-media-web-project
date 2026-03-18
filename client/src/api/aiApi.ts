import axios from "axios";
import { attachRefreshInterceptor } from "./api.utils";

export const aiApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/ai`,
  withCredentials: true,
});

attachRefreshInterceptor(aiApi);

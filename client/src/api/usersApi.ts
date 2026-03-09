import axios from "axios";
import { attachRefreshInterceptor } from "./apiUtils";

export const usersApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/users`,
  withCredentials: true,
});

attachRefreshInterceptor(usersApi);

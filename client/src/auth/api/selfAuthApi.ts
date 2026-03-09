import axios from "axios";
import { attachRefreshInterceptor } from "../../api/api.utils";

export const selfAuthApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  withCredentials: true,
});

attachRefreshInterceptor(selfAuthApi);

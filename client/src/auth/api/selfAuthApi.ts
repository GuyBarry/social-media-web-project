import axios from "axios";
import { attachRefreshInterceptor } from "../../api/apiUtils";

export const selfAuthApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  withCredentials: true,
});

attachRefreshInterceptor(selfAuthApi);

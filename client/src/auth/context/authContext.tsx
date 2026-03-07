import { createContext, useContext } from "react";
import type { UserLogin } from "../types/userLogin";
import type { UserRegistration } from "../types/userRegistration";
import type { User } from "../../entities/User";

export interface AuthResultHandlers {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
}

interface AuthContextValue {
  user: User | null;
  login: (
    userCredentials: UserLogin,
    authResultHandlers?: AuthResultHandlers,
  ) => Promise<void>;
  register: (
    registrationData: UserRegistration,
    authHandlers?: AuthResultHandlers,
  ) => Promise<void>;
  logout: (authHandlers?: AuthResultHandlers) => Promise<void>;
  updateUser: (formData: FormData) => Promise<void>;
  isLoadingUserAuth: boolean;
}
export const AuthContext = createContext<AuthContextValue>(
  null as unknown as AuthContextValue,
);

export const useAuth = () => useContext(AuthContext);

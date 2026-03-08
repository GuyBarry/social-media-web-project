import {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthContext,
  type AuthResultHandlers,
} from "../context/authContext";
import type { User } from "../../entities/User";
import { authApi } from "../api/authApi";
import { selfAuthApi } from "../api/selfAuthApi";
import type { UserLogin } from "../types/userLogin";
import type { UserRegistration } from "../types/userRegistration";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userId, setUserId] = useState<User['_id'] | null>(null);
  const [isLoadingUserAuth, setIsLoadingUserAuth] = useState(true);

  const navigate = useNavigate();

  const saveUserId = useCallback((id: User['_id'] | null) => {
    setUserId(id);
  }, []);

  const getUserMe = useCallback(async () => {
    try {
      const { data } = await selfAuthApi.post<{ user: User | null }>("/me");
      saveUserId(data.user?._id ?? null);
    } catch (error) {
      console.error("Get User Me went wrong", error);
    } finally {
      setIsLoadingUserAuth(false);
    }
  }, [saveUserId]);

  useEffect(() => {
    if (!isLoadingUserAuth) return;
    getUserMe();
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.post("/logout");
    } catch (error) {
      console.error("Logout went wrong", error);
    } finally {
      saveUserId(null);
      navigate("/login");
    }
  }, [navigate, saveUserId]);

  const onAuthenticationSuccess = useCallback(
    (id: User['_id']) => {
      saveUserId(id);
      navigate("/");
    },
    [navigate, saveUserId],
  );

  const login = useCallback(
    async (
      userLoginData: UserLogin,
      authResultHandlers?: AuthResultHandlers,
    ) => {
      await authApi
        .post<{ user: User }>("/login", userLoginData)
        .then(({ data: { user } }) => {
          authResultHandlers?.onSuccess?.(user);
          onAuthenticationSuccess(user._id);
        })
        .catch((error) => authResultHandlers?.onError?.(error as Error));
    },
    [onAuthenticationSuccess],
  );

  const register = useCallback(
    async (
      registrationDTO: UserRegistration,
      authResultHandlers?: AuthResultHandlers,
    ) => {
      await authApi
        .post<{ user: User }>("/registration", registrationDTO)
        .then(({ data: { user } }) => {
          authResultHandlers?.onSuccess?.(user);
          onAuthenticationSuccess(user._id);
        })
        .catch((error) => authResultHandlers?.onError?.(error as Error));
    },
    [onAuthenticationSuccess],
  );

  return (
    <AuthContext.Provider
      value={{ userId, login, register, logout, isLoadingUserAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

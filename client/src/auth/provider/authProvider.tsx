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
} from "../../context/authContext";
import type { User } from "../../entities/User";
import { authApi } from "../api/authApi";
import { selfAuthApi } from "../api/selfAuthApi";
import type { UserLogin } from "../types/userLogin";
import type { UserRegistration } from "../types/userRegistration";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUserAuth, setIsLoadingUserAuth] = useState(true);

  const navigate = useNavigate();

  const saveUser = useCallback((rawUser: User | null) => {
    if (!rawUser) {
      setUser(null);

      return;
    }

    const { birthDate, updatedAt, createdAt, ...otherFields } = rawUser;

    setUser({
      ...otherFields,
      updatedAt: new Date(updatedAt),
      createdAt: new Date(createdAt),
      birthDate: new Date(birthDate),
    });
  }, []);

  const getUserMe = useCallback(async () => {
    try {
      const { data } = await selfAuthApi.post<{ user: User | null }>("/me");

      saveUser(data.user);
    } catch (error) {
      console.error("Get User Me went wrong", error);
    } finally {
      setIsLoadingUserAuth(false);
    }
  }, [saveUser]);

  useEffect(() => {
    if (!user) {
      getUserMe();
    }
  }, [getUserMe, user]);

  const onAuthenticationSuccess = useCallback(
    (rawUser: User) => {
      saveUser(rawUser);
      navigate("/");
    },
    [navigate, saveUser],
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
          onAuthenticationSuccess(user);
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
          onAuthenticationSuccess(user);
        })
        .catch((error) => authResultHandlers?.onError?.(error as Error));
    },
    [onAuthenticationSuccess],
  );

  return (
    <AuthContext.Provider value={{ user, login, register, isLoadingUserAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

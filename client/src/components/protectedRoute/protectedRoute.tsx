import type { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/context/authContext";

export const ProtectedRoute : FC<PropsWithChildren> = ({ children }) => {
  const { userId, isLoadingUserAuth } = useAuth();

  if (!userId && !isLoadingUserAuth) {
    return <Navigate to="/login" />;
  }

  return children;
};

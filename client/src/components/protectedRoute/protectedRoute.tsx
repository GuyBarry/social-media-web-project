import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, isLoadingUserAuth } = useAuth();

  if (!user && !isLoadingUserAuth) {
    return <Navigate to="/login" />;
  }

  return children;
};

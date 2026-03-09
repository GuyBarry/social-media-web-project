import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/context/authContext";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { userId, isLoadingUserAuth } = useAuth();

  if (!userId && !isLoadingUserAuth) {
    return <Navigate to="/login" />;
  }

  return children;
};

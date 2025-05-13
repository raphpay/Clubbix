import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Chargement...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

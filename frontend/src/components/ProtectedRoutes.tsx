import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useAppSelector((state) => state.auth);

  // Not logged in
  if (!user) {
    toast.warn("Please login first!");
    return <Navigate to="/login" replace />;
  }

  // Logged in but not authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast.error("You are not authorized to access this page!");
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoutes;

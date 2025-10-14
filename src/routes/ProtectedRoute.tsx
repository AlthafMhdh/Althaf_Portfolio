import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";

type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = auth.currentUser;

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ isPrivate = false }) => {
  const { currentUser } = useAuth();
  return isPrivate ? (
    currentUser ? (
      <Outlet />
    ) : (
      <Navigate to="/login" />
    )
  ) : !currentUser ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;

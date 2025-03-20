import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ role, userRole, token, children }) => {
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ✅ Check if the user has the correct role
  if (role && userRole !== role) {
    return <Navigate to="/" />; // Redirect to Home if role mismatch
  }

  return children;
};

export default PrivateRoute;

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App"; // adjust the path if needed

const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  console.log("PrivateRoute - token:", user.token);
  if (!user.token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;

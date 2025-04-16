import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "../App";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    // Clear localStorage
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    localStorage.clear();

    Cookies.remove("token");
    Cookies.remove("accountType");
    Cookies.remove("userId");

    // remove "token" from Context API
    setUser({ token: "", accountType: "", userId: "" });

    // Redirect to login
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;

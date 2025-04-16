import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import GetAllUsers from "./components/GetAllUsers";
import Section1 from "./components/Section1";

// Create context outside the component
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState({
    token: "",
    accountType: "",
    userId: "",
  });

  // Helper function to get cookie by name
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  }

  // Run on Every Render
  useEffect(() => {
    if (user.token === "" || user.accountType === "" || user.userId) {
      const token = getCookie("token");
      const accountType = getCookie("accountType");
      const userId = getCookie("userId");
      if (token || accountType) {
        // save the data into the Context API
        setUser({ token: token, accountType: accountType, userId: userId });
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/getallusers" element={<GetAllUsers />} />
        <Route path="/booking" element={<Section1 />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      {/* <p>User Token: {user.token}</p> */}
      {/* <p>User AccountType: {user.accountType}</p> */}
      {/* <p>User Id: {user.userId}</p> */}
    </UserContext.Provider>
  );
}

export default App;

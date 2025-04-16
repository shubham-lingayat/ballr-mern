import React from "react";
import Logout from "../components/Logout";
import { UserContext } from "../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  function viewAllPrHandler() {
    navigate("/getallusers");
  }
  function gotoBookingPageHandler() {
    navigate("/booking");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome to Dashboard</h2>
      <Logout />
      {user.accountType == "Admin" ? (
        <button className="btn btn-primary" onClick={viewAllPrHandler}>
          View All Pr
        </button>
      ) : (
        ""
      )}
      {/* -------------- */}
      <button className="btn btn-primary" onClick={gotoBookingPageHandler}>
        Go To Booking
      </button>
    </div>
  );
};

export default Dashboard;

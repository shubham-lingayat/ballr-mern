import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const url = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${url}/getalluser`);
      const prUsers = (res.data.users || res.data).filter(
        (user) => user.accountType === "Pr"
      );
      setUsers(prUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleToggle = async (userId, currentStatus) => {
    const confirmChange = window.confirm(
      `Are you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this user?`
    );

    if (!confirmChange) return; // stop if user cancels

    try {
      const res = await axios.post(`${url}/updateisactive`, {
        prId: userId,
        isActive: !currentStatus,
      });

      // Update state locally after success
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  function dashboardHandler() {
    navigate("/dashboard");
  }

  return (
    <div style={{ padding: "20px" }}>
      <button className="btn btn-primary" onClick={dashboardHandler}>
        Go To Dashboard
      </button>
      <h2>PR Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Is Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name || "-"}</td>
                <td>{user.email}</td>
                <td>{user.contactNumber || "-"}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={user.isActive}
                    onChange={() => handleToggle(user._id, user.isActive)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GetAllUsers;

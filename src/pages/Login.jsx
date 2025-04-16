import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "../App";

const Login = () => {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_BASE_URL;

  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/login`, formData);

      // Store token and user in localStorage
      // localStorage.setItem("token", res.data.token);
      // localStorage.setItem("user", JSON.stringify(res.data.user));

      const { token, user } = res.data;
      if (!user.isActive) {
        toast.error("Your Account is Deactivated! Please Contact Admin");
      } else {
        toast.success("Login successful!");
        // Save token & user in cookies manually (if not httpOnly)
        Cookies.set("token", token, { expires: 7 }); // expires in 7 days
        Cookies.set("accountType", user.accountType, {
          expires: 7,
        });
        Cookies.set("userId", user._id, {
          expires: 7,
        });

        // save the data into the Context API
        setUser({
          token: token,
          accountType: user.accountType,
          userId: user._id,
        });

        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Login failed. Please check credentials.");
      console.error("Login Error:", error.response || error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 className="my-5">Login</h2>
      <form className="d-flex flex-column gap-2" onSubmit={handleSubmit}>
        <input
          className="p-2"
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />
        <input
          className="p-2"
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />
        <button className="p-2" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';


const Register = () => {

  const url = process.env.REACT_APP_BASE_URL;
  console.log(url);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "",
    contactNumber: "",
    otp: "",
    isActive: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Handle isActive based on accountType
    if (name === "accountType") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        isActive: value === "Admin",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/signup`, formData);
      toast.success("Signup successful!");
      console.log(res.data);
    } catch (error) {
        toast.error("Signup failed. Check the console.");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 className="my-5">Register Page</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
        <input className="p-2" type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input className="p-2" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="p-2" type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input className="p-2" type="tel" name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />
        <select className="p-2" name="accountType" value={formData.accountType} onChange={handleChange} required>
            <option value="">Select Account Type</option>
            <option value="Admin">Admin</option>
            <option value="Pr">Pr</option>
        </select>
        <button className="p-2" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Register;
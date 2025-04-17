import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../App";

const BookingForm = ({ date, tablenumber }) => {
  
  const url = process.env.REACT_APP_BASE_URL;
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    clientname: "",
    clientcount: "",
    clientcontact: "",
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
    const payload = {
      ...formData,
      tablenumber,
      clientcount: parseInt(formData.clientcount),
      clientcontact: parseInt(formData.clientcontact),
      date,
      userId: user.userId,
    };

    try {
      const response = await axios.post(
        `{url}/creatbooking`,
        payload
      );
      toast.success("Booking successful!");
      setFormData({ clientname: "", clientcount: "", clientcontact: "" });
    } catch (error) {
      toast.error("Booking failed!");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h3>
        Book Table {tablenumber} on {date}
      </h3>
      <input
        type="text"
        name="clientname"
        placeholder="Client Name"
        value={formData.clientname}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="clientcount"
        placeholder="Client Count"
        value={formData.clientcount}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="clientcontact"
        placeholder="Client Contact"
        value={formData.clientcontact}
        onChange={handleChange}
        required
      />
      <button type="submit">Create Booking</button>
    </form>
  );
};

export default BookingForm;

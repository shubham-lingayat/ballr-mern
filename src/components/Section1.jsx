import React, { useEffect, useState } from "react";
import BookingForm from "./BookingForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const getFormattedDate = (date) => {
  return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

const generateDateArray = (centerDate, range = 5) => {
  const dates = [];
  for (let i = -range; i <= range; i++) {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + i);
    dates.push(getFormattedDate(date));
  }
  return dates;
};

const tableOptions = [
  "A1",
  "A2",
  "A3",
  "B1",
  "B2",
  "B3",
  "C1",
  "C2",
  "C3",
  "D1",
  "D2",
  "D3",
];

function Section1() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(getFormattedDate(today));
  const [selectedTable, setSelectedTable] = useState("A1");
  const [dateOptions, setDateOptions] = useState(generateDateArray(today));
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/bookings/${selectedDate}`
        );
        if (response.status !== 200) {
          toast.success("No Bookings Found or Error");
        } else {
          console.log(response);
          setBookings(response.data.data.bookingdetails);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
      }
    };

    fetchBookings();
  }, [selectedDate]);

  function dashboardHandler() {
    console.log("Navigating to /dashboard");
    navigate("/dashboard");
  }

  return (
    <div style={{ padding: "1rem" }}>
      <button className="btn btn-primary" onClick={dashboardHandler}>
        Go To Dashboard
      </button>
      <h2>Select Date:</h2>
      <div style={{ display: "flex", overflowX: "auto", marginBottom: "1rem" }}>
        {dateOptions.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            style={{
              padding: "8px 12px",
              marginRight: "8px",
              background: date === selectedDate ? "#007bff" : "#f0f0f0",
              color: date === selectedDate ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {date}
          </button>
        ))}
      </div>

      <h2>Select Table:</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "1rem",
        }}
      >
        {tableOptions.map((table) => {
          const isBooked = bookings.some(
            (booking) => booking.tablenumber === table
          );

          return (
            <button
              key={table}
              onClick={() => !isBooked && setSelectedTable(table)}
              disabled={isBooked}
              style={{
                padding: "8px 12px",
                background: isBooked
                  ? "#ccc"
                  : table === selectedTable
                  ? "#28a745"
                  : "#f0f0f0",
                color: isBooked
                  ? "#666"
                  : table === selectedTable
                  ? "#fff"
                  : "#000",
                border: "none",
                borderRadius: "5px",
                cursor: isBooked ? "not-allowed" : "pointer",
                opacity: isBooked ? 0.6 : 1,
              }}
            >
              {table}
            </button>
          );
        })}
      </div>

      <BookingForm date={selectedDate} tablenumber={selectedTable} />

      <h3>Bookings for {selectedDate}:</h3>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking, index) => (
            <li key={index}>
              {booking.clientname} - Table {booking.tablenumber} -{" "}
              {booking.clientcount} people - Contact: {booking.clientcontact}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Section1;

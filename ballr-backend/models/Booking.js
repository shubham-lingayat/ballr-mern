const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userdetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    clientname: {
      type: String,
      trim: true,
      required: true,
    },
    tablenumber: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    clientcount: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    clientcontact: {
      type: Number,
      required: true,
      min: 5000000000,
      max: 9999999999,
    },
    dateDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "date",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);

const mongoose = require("mongoose");

const DateSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  bookingdetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

module.exports = mongoose.model("Date", DateSchema);

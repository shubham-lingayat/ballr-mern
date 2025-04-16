const Booking = require("../models/Booking");
const DateModel = require("../models/Date");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  try {
    // Extract data from request body
    const { clientname, tablenumber, clientcount, clientcontact, date } =
      req.body;
    const userId = req.user.id; // Assuming user is authenticated

    // Validate fields
    if (
      !clientname ||
      !tablenumber ||
      !clientcount ||
      !clientcontact ||
      !date
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the details" });
    }

    if (!userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User not found, please log in again",
        });
    }

    // 🔹 Step 1: Ensure a Date entry exists (if not, create one first)
    let dateEntry = await DateModel.findOneAndUpdate(
      { date },
      { $setOnInsert: { date, bookingdetails: [] } }, // Only set if creating a new entry
      { new: true, upsert: true } // Upsert ensures the document is created if not found
    );

    // 🔹 Step 2: Check if the table is already booked on that date
    const existingBooking = await Booking.findOne({
      tablenumber,
      dateDetails: dateEntry._id,
    });
    if (existingBooking) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "A booking already exists for this table on the selected date.",
        });
    }

    // 🔹 Step 3: Create a new Booking
    const bookingDetails = await Booking.create({
      userdetails: userId,
      clientname,
      tablenumber,
      clientcount,
      clientcontact,
      date,
      dateDetails: dateEntry._id, // Directly linking with DateModel
    });

    // 🔹 Step 4: Update DateModel with new booking
    await DateModel.findByIdAndUpdate(dateEntry._id, {
      $push: { bookingdetails: bookingDetails._id },
    });

    // 🔹 Step 5: Return response
    return res.status(200).json({
      success: true,
      message: "Booking created successfully!",
      databooking: bookingDetails,
      datadate: dateEntry,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
  }
};

// Get booking data from date
exports.getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.params;

    // Find bookings for the given date and populate user details
    const dateData = await DateModel.findOne({ date }).populate({
      path: "bookingdetails",
      populate: {
        path: "userdetails",
        select: "name email contactNumber accountType",
      },
    });

    if (!dateData) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this date",
      });
    }

    res.status(200).json({
      success: true,
      data: dateData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

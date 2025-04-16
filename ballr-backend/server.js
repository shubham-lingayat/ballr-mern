// Import express
// run express in app
const express = require("express");
const app = express();
// Cors for locahost
const cors = require("cors");

const allowedOrigins = ["http://localhost:3000", "http://localhost:4209"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// import dtenv
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// Cookie-Parser
// middleware
// const cookieparser = require("cookie-parser");
// app.use(cookieparser());

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(express.json());

// Route import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

// import databse file
require("./config/database").Connect();

// activate server by listening
app.listen(PORT, () => {
  console.log(`Server is Listening on ${PORT}`);
});

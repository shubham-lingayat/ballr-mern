const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require('../models/OTP');
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');
require("dotenv").config();

// Signup route handler
exports.signup = async (req,res)=>{
    try{
        // get data
        const {name,email,password, accountType, contactNumber, otp} = req.body;

        // Validate the data
        if (!name || !email || !password || !accountType || !contactNumber || !otp){
          return res.status(400).json({
            success:false,
            message:"Please fill all the details"
          })
        }

        // Check if user is already exists
        const existingUser = await User.findOne({email});

        if (existingUser){
            return res.status(400).json({
                success:false,
                message:'email address already exists',
            });
        }

        // find most recent OTP from the database for the same user
        const recentOTP = await OTP.find({ email })
          .sort({ createdAt: -1 })
          .limit(1);
          console.log(recentOTP);

          // validate the OTP
          if (recentOTP.length === 0) {
            return res.status(400).json({
              success: false,
              message: "OTP not found or email address is wrong!",
            });
          }
          
        if (otp !== recentOTP[0].otp) {
          return res.status(400).json({
            success: false,
            message: "Invalid OTP",
          });
        }

        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:'Error in Hashing Password',
            });
        }

        // Create Entry of user
        const user = await User.create({
            name,email,password:hashedPassword,accountType,contactNumber
        });

        return res.status(200).json({
            success:true,
            message:'User Created Successfully',
            data:user
        });  
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        });
    }
}

// Login 
exports.login = async (req,res) => {
    try {
        // fetch the data from req.body
        const {email, password} = req.body;
        // validation on email and password
        if (!email || !password){
            return res.status(400).json({
                success:false,
                message:'Please fill the details',
            });
        }

        // Check for user is registered or not
        let user = await User.findOne({email});
        // if not registered
        if (!user){
            return res.status(401).json({
                success:false,
                message:"user is not registerd",
            });
        }

        const payload = {
            email:user.email,
            id:user._id,
            accountType:user.accountType,
        }
        // verify password and generate JWT tokens
        if (await bcrypt.compare(password, user.password)){
            // password matched
            // JWT Tokens ------------------------------------------------------
            // actual data of user (for user verification as payload), JWT secret key, expires in 2 hours
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:"7d" });
            // save the token in DB for matching if required
            user = user.toObject();
            user.token = token;
            // make password undefined so hacker can't access
            user.password = undefined;

            const options = {
                // expire in 3 days
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            };
            // Cookie ----------------------------------------------------------
            // cookie name, above JWT token, additional options for security
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message: "user logged in successfully",
            });
        }
        else{
            // password does not matched
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

// Send OTP For Email Verification
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request body
    const { email } = req.body;

    // check if user already exists
    const checkUserPresent = await User.findOne({ email });

    // if user already exists, then return response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP Generated: ", otp);

    // Check Unique OTP or Not
    let result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);
    // run loop until we get unique OTP
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // Create an Entry in DB for OTP
    // when creating entry in DB 'OTP schema' it will send mail from model
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // return response successful
    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Can't send OTP Server Error, try again later",
    });
  }
};
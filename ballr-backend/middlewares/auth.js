// Authontication of user
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res, next)=>{
    try{
        // Extract JWT Token
        // three ways to collect token from request body
        // 1. directly from the request body
        // 2. From the cookies of the http request
        // 3. From the header of the http request -> Header conatins key value pairs -> key => "Authorization" value => "Bearer {token}"

        const tokencookie = req.cookies.token;

            if (!tokencookie) {
                return res.status(401).json({
                success: false,
                message: "Token missing from cookies",
                });
            }

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");
        
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Token has expired",
                });
            }
            console.log(err);
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }
        
        

    } catch(err){
            return res.status(401).json({
                success:false,
                message:'something went wrong, Token is Missing',
            });
    }
}

// isAdmin middleware
exports.isAdmin = (req,res, next) =>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin",
            });
        }
        next();
    } catch(err){
        return res.status(401).json({
            success:false,
            message:"Request body doesn't exists user role",
        });
    }
}
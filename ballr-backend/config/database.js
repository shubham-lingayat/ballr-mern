// import mongoose
// import dotenv
const mongoose = require('mongoose');
require('dotenv').config();

// export default function
exports.Connect = () => {
    try{
        // use mongoose.connect method
        mongoose.connect(process.env.MONGODB_URL)
        // if connected then console.log
        .then(()=>{
            console.log("DB Connected Successfully.");
        });
    }
    // catch error
    catch(err){
        console.log("DB Connection issues");
        console.log(err);
        process.exit(1);
    }
    
}
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    accountType:{
        type:String,
        enum:["Admin", "Pr"],
        required:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true
    }
})

module.exports = mongoose.model("user", userSchema);
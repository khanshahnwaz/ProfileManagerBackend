const mongoose= require('mongoose');

const User= new mongoose.Schema({
    Name:{
        type:String
    },
    Email:{
        type:String,
        unique:true
    },
    Phone:{
        type:String,
    },
    Photo:{
        type:String,
    },
    Password:{
        type:String
    }
})
const user= mongoose.model('user',User);
module.exports=user;
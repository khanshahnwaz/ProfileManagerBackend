const mongoose= require('mongoose');
const { type } = require('os');

const User= new mongoose.Schema({
    Name:{
        type:String
    },
    UserName:{
        type:String,
        
      
    },
    Gender:{
        type:String,
        enum:['Male','Female','Non Binary']
    },
    BirthDate:{
        type:Date
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
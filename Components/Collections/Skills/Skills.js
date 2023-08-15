const mongoose= require('mongoose');

const Skills=new mongoose.Schema({
    FID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    Skills:{
        type:Array
    },
    
  
})
const skills=mongoose.model('skills',Skills);
module.exports=skills;
const mongoose= require('mongoose');

const Education=new mongoose.Schema({
    FID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
   InstituteName:String,
   FromYear:Number,
   ToYear:Number,
   Degree:String,
   About:String
    
   
})
const education=mongoose.model('education',Education);
module.exports=education;
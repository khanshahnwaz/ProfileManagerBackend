const mongoose=require('mongoose');
const Certification=new mongoose.Schema({
    FID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    Certificate:{
        type:Array
    },
    //   Name:String,
    //   Place:String
})
const certification=mongoose.model('certification',Certification);
module.exports =certification;
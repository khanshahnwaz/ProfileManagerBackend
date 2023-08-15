const mongoose=require('mongoose')
const About=new mongoose.Schema({
    FID:{type:mongoose.Schema.Types.ObjectId,
        ref:'user'},
    About:String
})
const about=mongoose.model('about',About);
module.exports=about;
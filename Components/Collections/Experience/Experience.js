const mongoose=require('mongoose')

const Experience=mongoose.Schema(
    {
      
        FID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        ExperienceYear:{
            type:Number
        },
        FromYear:{
            type:Number
        },
        ToYear:{
            type:Number
        },
        CompanyName:{
            type:String
        },
        Role:{
            type:String
        },
        Type:{
            type:String
        }
    }
)
const experience=mongoose.model('experience',Experience);
module.exports=experience;
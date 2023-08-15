const mongoose=require('mongoose')
const Connection=new mongoose.Schema({
    FID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    SID:{
        type:mongoose.Schema.Types.ObjectId,
        reg:'user'

    }
})
 const connection=mongoose.model('connection',Connection)
 module.exports=connection;
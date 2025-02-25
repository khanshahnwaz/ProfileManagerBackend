const mongoose = require('mongoose');
const connection =  () => {
 const connect=mongoose.connect("mongodb+srv://khanshahnwaz:Anonymous786@profile.wxrlq.mongodb.net/?retryWrites=true&w=majority&appName=Profile")

    
    connect.then(()=>{
        console.log("Connection established.")
    })
    connect.catch((e)=>{
        console.log("Error while connecting ",e)
    })
}
module.exports=connection;
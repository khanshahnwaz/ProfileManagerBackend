// Database connection url 
const connection = require('./Components/Connection/DB_Connections');
// import {v2 as cloudinary} from 'cloudinary';
const fileUpload=require('express-fileupload')

// Database connection function 
connection();
const express = require('express');
const serverless=require('serverless-http')
const cors = require('cors')
const app = express();

// Middleware to send post request
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors())

// app.use(cors({
//     origin: ['http://localhost:3000'],
//     methods:["POST","GET","PUT","DELETE"],
//     credentials:true
//   }));
app.use(fileUpload({
    useTempFiles:true
}))


// vercel
const checkUser=require('./Components/LoginMiddleware/checkUser');
app.get('/',(req, res) => {
    res.send("Please route to correct page.Have a Good Day. IP address is: ")
    // console.log(req.socket.remoteAddress)
})
// Available routes
const user=require('./Components/Collections/User')
// for checking purpose
app.post('/user/signUp', async (req,res)=>{
    console.log(req.body)
    try{
    const result=await user.create({
        Name: req.body.name,
      Email: req.body.email,
      Phone: req.body.phone,
      Password: hashedPassword,
    })
    console.log(result)
}catch(err){
    return res.json(err)
}
//    return res.json(req.body);
})
// app.use('/user', require('./Components/Routes/User'));
app.use('/about',require('./Components/Routes/About'));
app.use('/skills',require('./Components/Routes/Skills'));
app.use('/certificates',require('./Components/Routes/Certificate'))
app.use('/experiences',require('./Components/Routes/Experience'))
app.use('/education',require('./Components/Routes/Education'))
app.use('/connection',require('./Components/Routes/Connections'))

app.listen(3001, () => {
    console.log('Listening at Localhost:3001')
})


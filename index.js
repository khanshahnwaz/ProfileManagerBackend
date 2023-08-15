// Database connection url 
const connection = require('./Components/Connection/DB_Connections');
// import {v2 as cloudinary} from 'cloudinary';
const fileUpload=require('express-fileupload')

// Database connection function 
connection();
const express = require('express');
const cors = require('cors')
const app = express();

// Middleware to send post request
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors())
app.use(fileUpload({
    useTempFiles:true
}))


// vercel

app.get('/', (req, res) => {
    res.send("Please route to correct page.Have a Good Day. IP address is: ")
    // console.log(req.socket.remoteAddress)
})
// Available routes 
app.use('/user', require('./Components/Routes/User'));
app.use('/about',require('./Components/Routes/About'));
app.use('/skills',require('./Components/Routes/Skills'));
app.use('/certificates',require('./Components/Routes/Certificate'))
app.use('/experiences',require('./Components/Routes/Experience'))
app.use('/education',require('./Components/Routes/Education'))
app.use('/connection',require('./Components/Routes/Connections'))

app.listen(3001, () => {
    console.log('Listening at Localhost:3001')
})


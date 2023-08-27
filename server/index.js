const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
// const http = require('http');
require("dotenv").config();

const port = 8000;
const app = express();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(morgan('tiny'))

// was getting Access-Control-Allow-Origin issue
// followed tutorial here
// https://www.freecodecamp.org/news/access-control-allow-origin-header-explained/
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

app.get('/', (req, res) => {
    res.status(200).json({message: 'hello world!'});
})

const fs = require('fs');
const path = require('path');

app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
  console.log("hello from backend, /api/upload-audio");
  console.log("I have this:", req.file);

  try {

    const tempFilePath = path.join(__dirname, 'temp_audio.webm');
    fs.writeFileSync(tempFilePath, req.file.buffer);

    const result = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: 'auto',
        format: 'webm' 
    });

    console.log('Uploaded to Cloudinary:', result);

  
    fs.unlinkSync(tempFilePath);

    res.json({ success: true, message: 'Audio uploaded successfully' });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})


// app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
//     console.log("hello from backend, /api/upload-audio");
    
//     try {
//       const result = await cloudinary.uploader.upload(req.file.buffer, {
//         resource_type: 'raw', 
//         public_id: 'test-id',
//         overwrite: true, 
//         format: 'webm', 
//       });
  
//       console.log('Uploaded to Cloudinary:', result);
  
//       res.json({ success: true, message: 'Audio uploaded successfully' });
//     } catch (error) {
//       console.error('Error uploading to Cloudinary:', error);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//   })
  



app.listen(port, () => {
    console.log(`Server is up and listening at port : ${port}`);
})
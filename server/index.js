const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
// const http = require('http');
const { MongoClient } = require("mongodb");


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

require("dotenv").config();
const { MONGO_URI } = process.env;
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


app.get('/api/get-audio', async (req, res) => {
    try {
      
      const results = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/video`, {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.CLOUDINARY_API_KEY + ':' + process.env.CLOUDINARY_API_SECRET).toString('base64')}`
        }
      }).then(r => r.json());

      //const data = await cloudinaryResponse.json();
      console.log("data:", results);
      res.json(results.resources);
    } catch (error) {
      console.error('Error fetching audio resources:', error);
      res.status(500).json({ success: false, message: 'Error fetching audio resources' });
    }
  });
  

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

    // send part of this result to Mongo.
    // database: music-branches
    // collection: users
    // will break all of this out to handler files.

    const client = new MongoClient(MONGO_URI, options);
        try {
            await client.connect();
            const dbName = "music-branches";
            const db = client.db(dbName);
            console.log("hello from attempted mongo");
            const mongoResult = await db.collection("users").insertOne(result);
            client.close();
            //return res.status(201).json({ status: 201, message: "success", mongoResult });
        } catch (err) {
            //res.status(500).json({ status: 500, message: err.message });
        }



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
const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { MongoClient } = require("mongodb");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

require("dotenv").config();
const { MONGO_URI } = process.env;
const port = 8000;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(morgan('tiny'))

  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })

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
      // const user = req.query.user;
      // const project = req.query.project;
      let publicIds;
      const user = decodeURIComponent(req.query.user);
      const project = decodeURIComponent(req.query.project);

      console.log("hello from backend,", user, project);
     
      // lookup audio clips from user/project in MongoDB
      // return just the public_Ids of the clips
      try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const dbName = "music-branches";
        const db = client.db(dbName);
        const audioClips = await db.collection("users")
        .find({ user, project }, { projection: { public_id: 1, _id: 0 } })
        .toArray();
        // const audioClips = await db.collection("users").find();
        console.log("audioClips:", audioClips);
        // create comma-separated strings:
        publicIds = await audioClips.map(clip => clip.public_id).join(',');
        console.log("publicIds:", publicIds);

        client.close();
        //return res.status(201).json({ status: 201, message: "success", mongoResult });
    } catch (err) {
        //res.status(500).json({ status: 500, message: err.message });
        console.log("failed to lookup user/project from mongo");
    }

    
    console.log("publicIds:", publicIds);
    if (!publicIds) {
      // Return a response indicating no clips were found
      return res.status(200).json({ message: 'No clips found for this user/project combination' });

    }
    

      // const results = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/video/`, {
        const results = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/video?public_ids=${publicIds}`, {

        headers: {
          Authorization: `Basic ${Buffer.from(process.env.CLOUDINARY_API_KEY + ':' + process.env.CLOUDINARY_API_SECRET).toString('base64')}`
        }
      }).then(r => r.json());

      // need second lookup for tags
      const tagsArray = await Promise.all(results.resources.map(async (resource) => {
        const result = await cloudinary.api.resource(resource.public_id, { type: 'upload', resource_type: 'video' });
        return result.tags;
      }));

      // merge tags with main array before returning
      const mergedArray = results.resources.map((item, index) => {
        const tags = tagsArray[index] || [];
        return { ...item, tags };
      });
      
      // res.json(results.resources);
      res.json(mergedArray);
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

  const { tags, user, project } = req.body;
  console.log("user / project:", user, project);

  try {

    const tempFilePath = path.join(__dirname, 'temp_audio.webm');
    fs.writeFileSync(tempFilePath, req.file.buffer);

    const result = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: 'auto',
        format: 'webm',
        tags: tags, 
    });

    console.log('Uploaded to Cloudinary:', result);

    fs.unlinkSync(tempFilePath);
    res.json({ success: true, message: 'Audio uploaded successfully' });

    // add user & project key:value pairs to the object
    const updatedResult = {
      ...result, 
      user: user, 
      project: project,
    };

    // then add to MongoDB
    const client = new MongoClient(MONGO_URI, options);
        try {
            await client.connect();
            const dbName = "music-branches";
            const db = client.db(dbName);
            console.log("hello from attempted mongo");
            const mongoResult = await db.collection("users").insertOne(updatedResult);
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

app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  const { tags } = req.body;

  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(dataURI, { tags: tags });
    console.log('Uploaded to Cloudinary:', cloudinaryResult);

    // Add MongoDB info
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const dbName = "music-branches";
    const db = client.db(dbName);

    const mongoResult = await db.collection("sheets").insertOne(cloudinaryResult);
    client.close();

    res.status(200).json({ success: true, message: 'Image uploaded successfully', cloudinaryResult, mongoResult });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// app.post('/api/upload-image', upload.single('image'), async (req, res) => {
 
//    const { tags } = req.body;

//   try {
//     // would this same encoding work for the audio
//     // and not have to save temp file on fs?
//     const b64 = Buffer.from(req.file.buffer).toString("base64");
//     let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

//     const result = await cloudinary.uploader.upload(dataURI, {tags: tags});

//     console.log('Uploaded to Cloudinary:', result);

//     // now add Mongo DB info in /sheets collection
//     const client = new MongoClient(MONGO_URI, options);
//         try {
//             await client.connect();
//             const dbName = "music-branches";
//             const db = client.db(dbName);
//             console.log("hello from attempted mongo");
//             const mongoResult = await db.collection("sheets").insertOne(result);
//             client.close();
//             //return res.status(201).json({ status: 201, message: "success", mongoResult });
//         } catch (err) {
//             //res.status(500).json({ status: 500, message: err.message });
//         }

//   } catch (error) {
//     console.error('Error uploading to Cloudinary:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// })



app.get('/api/get-images', async (req, res) => {
  try {
    
    const results = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image`, {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.CLOUDINARY_API_KEY + ':' + process.env.CLOUDINARY_API_SECRET).toString('base64')}`
      }
    }).then(r => r.json());

    //console.log("results:", results);

    res.json(results.resources);
  } catch (error) {
    console.error('Error fetching audio resources:', error);
    res.status(500).json({ success: false, message: 'Error fetching audio resources' });
  }
});


app.delete('/api/delete-audio/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const options = "";

    // Delete from Cloudinary
    const public_id = id;
    const cloudinaryResult = await cloudinary.uploader.destroy(public_id, {
      type: 'upload',
      resource_type: 'video',
    });
    console.log("cloudinaryResult:", cloudinaryResult);

    // Remove from MongoDB
    const client = new MongoClient(MONGO_URI, options);

    try {
      await client.connect();
      const dbName = "music-branches";
      const db = client.db(dbName);

      const query = { public_id: id };
      const mongoResult = await db.collection("users").deleteOne(query);

      console.log("mongo result:", mongoResult);
      client.close();

      // Both Cloudinary and MongoDB operations completed successfully
      return res.status(200).json({ message: "Success" });
    } catch (err) {
      console.error('Error deleting from MongoDB:', err);
      return res.status(500).json({ message: 'Error deleting from MongoDB' });
    }
  } catch (error) {
    console.error('Error deleting audio resources:', error);
    return res.status(500).json({ message: 'Error deleting audio resources' });
  }
});


// app.delete('/api/delete-audio/:id', async (req, res) => {

//   const id = req.params.id;
//   try {
    
//     const options = "";

//     const public_id = id;
//     const cloudinaryResult = await cloudinary.uploader.destroy(public_id, {type : 'upload', resource_type : 'video'});
//     console.log("cloudinaryResult:", cloudinaryResult);

//     // also need to remove from Mongo
//     const client = new MongoClient(MONGO_URI, options);
//   try {
//     await client.connect();
//     const dbName = "music-branches";
//     const db = client.db(dbName);
 
//     const query = { public_id: id };
//     const results = await db.collection("users").deleteOne(query);

//     console.log("mongo result:", results);
//     client.close();
//     //return res.status(201).json({ status: 201, message: "success", result });
//   } catch (err) {
//     //res.status(500).json({ status: 500, message: err.message });
//   }

//     res.json(results.resources);
//   } catch (error) {
//     //console.error('Error deleting audio resources:', error);
//     //res.status(500).json({ success: false, message: 'Error fetching audio resources' });
//   }
// });

app.post('/api/update-tags', async (req, res) => {
  console.log("hello from backend, /api/update-tags");
  console.log("I have this:", req.body);

  const tagsToAdd = req.body.tags;
  const publicId = req.body.publicId;
  console.log("publicId:", publicId)
  
  try {
    // Update tags in Cloudinary
    const cloudinaryResult = await cloudinary.uploader.add_tag(tagsToAdd, publicId, { type: 'upload', resource_type: 'video' });
    console.log("Cloudinary response", cloudinaryResult);

    // Update tags in MongoDB
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const dbName = "music-branches";
    const db = client.db(dbName);
 
    const query = { public_id: publicId };
    const action = {
      $push: {
        tags: { $each: tagsToAdd },
      },
    };
    const mongoResult = await db.collection("users").updateOne(query, action);

    console.log("Mongo result:", mongoResult);
    client.close();

    // Both Cloudinary and MongoDB operations completed successfully
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error('Error updating tags:', error);
    return res.status(500).json({ message: 'Error updating tags' });
  }
});


// app.post('/api/update-tags', async (req, res) => {
//   console.log("hello from backend, /api/update-tags");
//   console.log("I have this:", req.body);

//   const tagsToAdd = req.body.tags;
//   const publicId = req.body.publicId;
//   console.log("publicId:", publicId)
  
//   // update tags in Cloudinary
//   const result = await cloudinary.uploader.add_tag(tagsToAdd, publicId, {type : 'upload', resource_type : 'video'});
//   console.log("response", result);

//   // update tags in Mongo
//   const client = new MongoClient(MONGO_URI, options);
//   try {
//     await client.connect();
//     const dbName = "music-branches";
//     const db = client.db(dbName);
 
//     const query = { public_id: publicId };
//     const action = {
//       $push: {
//         tags: { $each: tagsToAdd },
//       },
//     };
//     const results = await db.collection("users").updateOne(query, action);

   

//     console.log("mongo result:", results);
//     client.close();
//     //return res.status(201).json({ status: 201, message: "success", result });
//   } catch (err) {
//     //res.status(500).json({ status: 500, message: err.message });
//   }

 
// })


app.delete('/api/delete-tag/:publicId/:tags', async (req, res) => {
  console.log("hello from backend, /api/delete-tag");

  const publicId = req.params.publicId;
  const tagsToDelete = req.params.tags;

  console.log("publicId:", publicId);
  console.log("tagsToDelete:", tagsToDelete);

  try {
    // Update tags in Cloudinary
    const cloudinaryResult = await cloudinary.uploader.remove_tag(tagsToDelete, publicId, { type: 'upload', resource_type: 'video' });
    console.log("Cloudinary response", cloudinaryResult);

    // Update tags in MongoDB
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const dbName = "music-branches";
    const db = client.db(dbName);

    const query = { public_id: publicId };
    const action = {
      $pull: {
        tags: { $in: [tagsToDelete] },
      },
    };

    const mongoResult = await db.collection("users").updateOne(query, action);

    console.log("Mongo result:", mongoResult);
    client.close();

    // Both Cloudinary and MongoDB operations completed successfully
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error('Error deleting tags:', error);
    return res.status(500).json({ message: 'Error deleting tags' });
  }
});


// app.delete('/api/delete-tag/:publicId/:tags', async (req, res) => {
//   console.log("hello from backend, /api/delete-tag");
//   // console.log("I have this:", req.body);

//   const publicId = req.params.publicId;
//   const tagsToDelete = req.params.tags;

//   console.log("publicId:", publicId);
//   console.log("tagsToDelete:", tagsToDelete);

  
//   // // update tags in Cloudinary
//   const result = await cloudinary.uploader.remove_tag(tagsToDelete, publicId, {type : 'upload', resource_type : 'video'});
//   console.log("response", result);

//   // // update tags in Mongo
//   const client = new MongoClient(MONGO_URI, options);
//   try {
//     console.log("in mongo");
//     await client.connect();
//     const dbName = "music-branches";
//     const db = client.db(dbName);
    
//     console.log("mongo tagsToDelete:", tagsToDelete);
//     console.log("this is a:", typeof(tagsToDelete));
//     const tagArray = [tagsToDelete];
//     console.log("mongo tagArray:", tagArray);
//     console.log("this is an:", typeof(tagArray));

//     const query = { public_id: publicId };
//     const action = {
//       $pull: {
//         tags: { $in: tagArray },
//       },
//     };
//     console.log("query:", query);
//     console.log("action:", action);
   
//     const results = await db.collection("users").updateOne(query, action);
   
//     console.log("mongo result:", results);
//     client.close();
//     //return res.status(201).json({ status: 201, message: "success", result });
//   } catch (err) {
//     //res.status(500).json({ status: 500, message: err.message });
//   }

 
// })


app.listen(port, () => {
    console.log(`Server is up and listening at port : ${port}`);
})
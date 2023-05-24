const express = require('express')
const mongoose = require("mongoose")
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,

});

const offerRoutes = require("./routes/offer")
app.use(offerRoutes)

const userRoutes = require("./routes/user")
app.use(userRoutes)

app.get("/", (req, res) => {
    res.json("My MD's project deployed on Northflank ");
  });
  


app.listen(process.env.PORT, () => {
    console.log("Server started");
  });



//ne pas oublier de faire installer les packages express axios uid2 crypto-js , express-fileupload , cloudinary , dotenv , cors

// mettre le mongoose.connect sur le fichier .env 
//et mettre mongoose.connect(process.env.MONGODB_URI); sur le fichier principal


//lors du déploiement , remplacer le port(3000) dans app.listen par (process.env.PORT, ()....) 
const express = require('express')
const path = require("path")
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const passport = require('passport')
const connectDB = require("./config/dbConnect")
const bodyParser = require('body-parser')
var cors = require('cors')
const webPush = require('web-push');
const vapidKeys = webPush.generateVAPIDKeys();
const publicKey = vapidKeys.publicKey;

webPush.setVapidDetails(
    'mailto:rpsethu1471@gmail.com',
    publicKey,
    vapidKeys.privateKey
);
dotenv.config({ path: './config/config.env' });
connectDB();
  
const app = express();
app.use(bodyParser.json());
app.use(cors());

//dist
app.use('/', express.static(path.join(__dirname, 'dist')));

// Make Images "Uploads" Folder Publicly Available
app.use('/uploads', express.static('./uploads'));
app.use('/images', express.static('./postuploads'));

//Routes
app.use('/post', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/notify', require('./routes/notify'));
app.get('/key', (req, res) => {
    res.json(publicKey);
});


const PORT = process.env.PORT;

app.listen(PORT, console.log("Running on port", PORT, "mode", process.env.NODE_ENV));
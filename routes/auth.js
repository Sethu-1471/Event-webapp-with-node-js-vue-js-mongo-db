const express = require('express')
const passport = require('passport')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const multer = require('multer');
var path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

let upload = multer({storage: storage}).single("file");
// @desc    Register
// @route   GET /auth/register
router.post('/register', upload , AuthController.register);

// @desc    Login
// @route   GET /auth/login
router.post('/login', AuthController.login);



module.exports = router
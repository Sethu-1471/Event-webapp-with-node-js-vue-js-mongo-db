const express = require('express')
const router = express.Router()
const EventController = require('../controllers/EventController')
const passport = require('passport')
require('../config/passport')(passport);

router.post('/save', passport.authenticate('jwt', { session: false }), EventController.savePost);

router.put('/update', passport.authenticate('jwt', { session: false }), EventController.updatePost);

router.delete('/delete', passport.authenticate('jwt', { session: false }), EventController.deletePost);

router.get('/getbypublic', EventController.getPostByPublic);

router.get('/getbyuserid', passport.authenticate('jwt', { session: false }), EventController.getPostByUserId);

router.get('/getbypostid', EventController.getPostByPostId);


module.exports = router;
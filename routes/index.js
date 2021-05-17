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

router.put('/attend', passport.authenticate('jwt', { session: false }), EventController.attendEvent);

router.put('/unattend', passport.authenticate('jwt', { session: false }), EventController.unattendEvent);

router.put('/sendcertificate', passport.authenticate('jwt', { session: false }), EventController.sendCertificate);

router.put('/feedback', passport.authenticate('jwt', { session: false }), EventController.updateFeedback);

router.put('/save', passport.authenticate('jwt', { session: false }), EventController.saveEvent);

router.put('/unsave', passport.authenticate('jwt', { session: false }), EventController.unSaveEvent);

router.get('/sudoevent', passport.authenticate('jwt', { session: false }), EventController.getsudoEvent);

router.get('/getbypostid', EventController.getPostByPostId);


module.exports = router;
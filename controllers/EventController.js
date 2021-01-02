const upload = require("../multer/storage");
const Event = require('../models/Event')
const User = require('../models/UserReg');
const fs = require("fs");

const savePost = async (req, res, next) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } else {
        upload(req, res, async (err) => {
            if(req.file == null || req.file == undefined || req.file == ""){
                res.json({
                    status: false,
                    message: "No image set"
                });
            }else{
                if (err) {
                    res.json({
                        status: false,
                        message: err.message
                    });
                } else {
                    let event = new Event({
                        name: req.body.name,
                        desc: req.body.desc,
                        image: req.file.filename,
                        start: req.body.start,
                        end: req.body.end,
                        mode: req.body.mode,
                        public: req.body.public,
                        tags: req.body.tags,
                        createdBy: await User.findById({ _id: req.body.admin }),
                        registration: req.body.registration
                    });
                    await event.save(()=>{
                        if (err) res.json({
                            status: false,
                            message: err.message
                        });
                        res.json({
                            status: true,
                            message: "event hosted"
                        });
                    });
                }
            }
        });
    }
}

const updatePost = async(req, res) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({ status: false, message: 'Unauthorized.' });
    } else {
        var mongoose = require('mongoose');
        var id = mongoose.Types.ObjectId((req.query.postId));
        let event = await Event.find({ _id: id });
        if (event[0].createdBy._id != req.query.userId) {
            res.json({
                status: false,
                message: "couldnt Update. Unauthorized user"
            });
        } else {
        try {
            if (req.query.withImage) {
                //image changed
                let $filePath = "./postuploads/" + req.query.orginalImage
                await fs.unlinkSync($filePath, (err) => {
                    if (err) {
                        res.json({
                            status: false,
                            message: "couldnt delete " + req.params.id + " image"
                        });
                    }
                })
                
                upload(req, res, async (err) => {
                    if (req.file == null || req.file == undefined || req.file == "") {
                        res.json({
                            status: false,
                            message: "No image set"
                        });
                    } else {
                        if (err) {
                            res.json({
                                status: false,
                                message: err.message
                            });
                        } else {
                            let event = {
                                name: req.body.name,
                                desc: req.body.desc,
                                image: req.file.filename,
                                start: req.body.start,
                                end: req.body.end,
                                mode: req.body.mode,
                                public: req.body.public,
                                tags: req.body.tags,
                                registration: req.body.registration
                            }
                            var mongoose = require('mongoose');
                            var id = mongoose.Types.ObjectId((req.query.postId));
                            await Event.findOneAndUpdate({ _id: id }, event, {
                                new: true,
                                runValidators: true,
                            }).then(response => {
                                res.json({
                                    status: true,
                                    message: "Event Updated"
                                });
                            }).catch(err => {
                                res.json({
                                    status: false,
                                    message: err.message
                                });
                            })
                        }
                    }
                });
                
            
            } else {
                //image un-changed
                var mongoose = require('mongoose');
                var id = mongoose.Types.ObjectId((req.query.postId));
                await Event.findOneAndUpdate({ _id: id }, req.body, {
                    new: true,
                    runValidators: true,
                }).then(response => {
                    res.json({
                        status: true,
                        message: "Event Updated"
                    });
                }).catch(err => {
                    res.json({
                        status: false,
                        message: err.message
                    });
                })
            }
        } catch (err) {
            res.json({
                status: false,
                message: err.message
            });
        }
    }
    }
}

const deletePost = async (req, res) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    }
    try {
        var mongoose = require('mongoose');
        var id = mongoose.Types.ObjectId((req.query.postId));
        let event = await Event.find({ _id: id });
        if (event[0].createdBy._id != req.query.userId) {
            res.json({
                status: false,
                message: "couldnt Delete. Unauthorized user"
            });
        } else {
            await Event.deleteOne({ _id: id }).then(resp => {
                let $filePath = "./postuploads/" + req.query.image
                fs.unlinkSync($filePath)
            })
            var mongoose = require('mongoose');
        var id = mongoose.Types.ObjectId((req.query.userId));
        let events = await Event.find({ "createdBy._id": id });
        res.json({
            status: true,
            events: events.length > 0 ? events : null
        });
        }
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}

const getPostByPublic = async(req, res) => {
    try {
        let events = await Event.find({ public: true });
        res.json({
            status: true,
            events: events
        });
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}

const getPostByUserId = async (req, res) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    }
    try {
        var mongoose = require('mongoose');
        var id = mongoose.Types.ObjectId((req.query.id));
        let events = await Event.find({ "createdBy._id": id });
        res.json({
            status: true,
            events: events.length > 0 ? events : null
        });
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}

const getPostByPostId = async(req, res) => {
    try {
        let event = await Event.find({ _id: req.query.postId });
        if (event[0].public) {
            res.json({
                status: true,
                event: event[0]
            });   
        } else {
            if (event[0].createdBy._id == req.query.userId) {
                res.json({
                    status: true,
                    event: event[0]
                }); 
            } else {
                res.json({
                    status: false,
                    message: "Event is not published. Contact owner."
                });
            }
        }
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}


const getToken = (headers) => {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
};
  
module.exports = { savePost, updatePost, deletePost, getPostByPublic, getPostByUserId, getPostByPostId }